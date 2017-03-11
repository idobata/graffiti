import { actionTypes as types } from '../constants';
import Lokka from 'lokka';
import HttpTransport from 'lokka-transport-http';

const transport = new HttpTransport(`${process.env.IDOBATA_URL}/api/graphql`, {
  headers: {
    'Authorization': `Bearer ${process.env.IDOBATA_API_TOKEN}`,
    'X-Idobata-Client-ID': 'yummy'
  }
});

const client = new Lokka({transport});

export const addGuys = (guys) => ({type: types.ADD_GUYS, guys})
export const addMessages = (messages) => ({type: types.ADD_MESSAGES, messages})
export const setCurrentGuy = (guy) => ({type: types.SET_CURRENT_GUY, guy})

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
          room {
            name
            organization { slug }
          }
        }
      }
    }
  }`;

  client.mutate(mutationQuery, {input: {roomId, source}}).then(({newMessage}) => {
    dispatch(addMessages([newMessage.messageEdge.node]));
    dispatch({type: types.SEND_MESSAGE_SUCCESS});
  });
}
