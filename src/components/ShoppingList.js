import React from 'react';

export default class ShoppingList extends React.Component {
  render() {
    const list = this.props.list;

    if (!list) return null;

    return (
      <ul>
        {list.map(
          (shoppingListItem, index) => (
            <li key={index}>
              {shoppingListItem}
            </li>
          )
        )}
      </ul>
    );
  }
}
