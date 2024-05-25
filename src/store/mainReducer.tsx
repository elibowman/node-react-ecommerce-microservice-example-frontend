const reducer = (currentState: any, event: any) => {
    if (event.type === 'setUserId') {
      return {
        ...currentState,
        userId: event.state.userId
      };
    }
    else if (event.type === 'setRefreshToken') {
      return {
        ...currentState,
        refreshToken: event.state.refreshToken
      }
    }
    else if (event.type === 'setAccessToken') {
      return {
        ...currentState,
        accessToken: event.state.accessToken
      };
    }
    else if (event.type === 'setUidRefreshAndAccessToken') {
      return {
        ...currentState,
        userId: event.state.userId,
        refreshToken: event.state.refreshToken,
        accessToken: event.state.accessToken
      }
    }
    else if (event.type === 'setRefreshAndAccessToken') {
      return {
        ...currentState,
        refreshToken: event.state.refreshToken,
        accessToken: event.state.accessToken
      }
    }
    else if (event.type === 'setCart') {
      localStorage.setItem('cart', JSON.stringify(event.state.cart));
      // return {
      //   ...currentState,
      //   cart: event.state.cart
      // }
      return {
        ...currentState,
        cart: JSON.parse(localStorage.getItem('cart') as string)
      }
    }
    else if (event.type == 'setOrder') {
      localStorage.setItem('order', JSON.stringify(event.state.order));
      return {
        ...currentState,
        order: JSON.parse(localStorage.getItem('order') as string)
      };
    }
    else if (event.type === 'setAny') {
      return {
        ...currentState,
        ...event.state
      }
    }
    else if (event.type === 'resetAll') {
      return {};
    }
    else {
      return currentState;
    }
  };

  export default reducer;