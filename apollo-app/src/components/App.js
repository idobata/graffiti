import React, { Component } from 'react';
import { gql, graphql } from 'react-apollo';

const SeedQuery = gql`
  query SeedQuery {
    currentGuy {
      name
      iconUrl

      rooms {
        edges {
          node {
            id
            name

            organization {
              id
              name
              slug
            }
          }
        }
      }
    }
  }
`;

@graphql(SeedQuery)
export default class extends Component {
  render() {
    if (this.props.data.loading) {
      return (<div />);
    }

    const currentGuy = this.props.data.currentGuy;

    return (
      <div>
        <aside style={{display: 'inline-block'}}>
          <img src={currentGuy.iconUrl} alt={currentGuy.name} style={{width: '70px', borderRadius: '35px'}} />
        </aside>
      </div>
    );
  }
}
