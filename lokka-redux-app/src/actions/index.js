import { actionTypes as types } from '../constants';
import Lokka from 'lokka';
import HttpTransport from 'lokka-transport-http';

// TODO: almost logics have to be moved to another place...

const clientId = String(Math.random());
const transport = new HttpTransport(`${process.env.IDOBATA_URL}/api/graphql`, {
  headers: {
    'Authorization': `Bearer ${process.env.IDOBATA_API_TOKEN}`,
    'X-Idobata-Client-ID': clientId
  }
});

const client = new Lokka({transport});
let eventSource;

export const addGuys = (guys) => ({type: types.ADD_GUYS, guys})
export const addMessages = (messages) => ({type: types.ADD_MESSAGES, messages})
export const setCurrentGuy = (guy) => ({type: types.SET_CURRENT_GUY, guy})
export const setCurrentRoom = (room) => ({type: types.SET_CURRENT_ROOM, room})

export const connectEventd = () => (dispatch) => {
  dispatch({type: types.CONNECT_EVENTD_REQUEST});

  eventSource = new EventSource(`${process.env.IDOBATA_EVENTD_URL}/api/stream?client_id=${clientId}&access_token=${process.env.IDOBATA_API_TOKEN}`);
  eventSource.addEventListener('open', () => {
    dispatch({type: types.CONNECT_EVENTD_SUCCESS});
  });

  eventSource.addEventListener('event', (e) => {
    const {type, data} = JSON.parse(e.data);

    if (type !== 'message:created') { return; }

    const message = data.message;

    // TODO: ignore if it's not for current selected room
    dispatch(addMessages({
      id: window.btoa(`Message-${message.id}`),
      body: message.body,
      sender: {name: message.sender_name},
    }));
  });
}

export const setupSeed = () => (dispatch) => {
  dispatch({type: types.SETUP_SEED_REQUEST});

  client.query(`
    {
      currentGuy {
        id
        name
        iconUrl

        organizations {
          edges {
            node {
              id
              name
              slug

              rooms {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  `).then((result) => {
    const currentGuy = result.currentGuy;
    const guy = {id: currentGuy.id, name: currentGuy.name, iconUrl: currentGuy.iconUrl};

    dispatch(setCurrentGuy(currentGuy));
    dispatch(addGuys([guy]));
    dispatch({type: types.SETUP_SEED_SUCCESS});
  });
}

export const fetchMessages = (roomId) => (dispatch) => {
  dispatch({type: types.FETCH_MESSAGES_REQUEST});

  client.query(`
    query _($roomId: ID!) {
      messages(roomId: $roomId) {
        edges {
          node {
            id
            body
            sender { name }
            room {
              name
              organization { slug }
            }
          }
        }
      }
    }
  `, {roomId}).then(({messages}) => {
    dispatch(addMessages(messages.edges.map(({node}) => node)));
    dispatch({type: types.FETCH_MESSAGES_SUCCESS});
  });
}

export const sendMessage = ({roomId, source}) => (dispatch) => {
  dispatch({type: types.SEND_MESSAGE_REQUEST});

  const mutationQuery = `($input: CreateMessageInput!) {
    newMessage: createMessage(input: $input) {
      messageEdge {
        node {
          id
          body
          sender { name }
        }
      }
    }
  }`;

  client.mutate(mutationQuery, {input: {roomId, source}}).then(({newMessage}) => {
    dispatch(addMessages([newMessage.messageEdge.node]));
    dispatch({type: types.SEND_MESSAGE_SUCCESS});
  });
}
