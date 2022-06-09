import * as actionType from "../actionType";

const initialState = {
  loading: false,
  error: null,
  requests: [
    {
      _id: "629f8ac46846009d811c58a6",
      user: {
        sellerStatus: "pending",
        _id: "6268ba07e3c4e3e6f7de6445",
        name: "Testing Dev",
        gender: "male",
        email: "erwerwrwrwr@gmail.com",
        password: "$2b$10$2AteQ4uNHnpARsbjOjH.Le/G6WdOChk0e0OtnmmiLj0q3k3rI6Sqq",
        address: [
          "628dec55f18926db8f29d6df",
          "628ded5f1c6de05236aaffa2",
          "628dedbc9b9268bc9f0c2c8e",
          "628e0e03132cc004deeecc0a"
        ],
        status: "approved",
        dob: "2022-04-17T00:00:00.000Z",
        account_type: "user",
        createdAt: "2022-04-27T03:35:35.264Z",
        updatedAt: "2022-05-25T11:07:47.967Z",
        "__v": 0
      },
      reasonMessage: "order",
      status: "accepted",
      chats: [
        {
          user: {
            sellerStatus: "pending",
            _id: "6268ba07e3c4e3e6f7de6445",
            name: "Testing Dev",
            gender: "male",
            email: "erwerwrwrwr@gmail.com",
            password: "$2b$10$2AteQ4uNHnpARsbjOjH.Le/G6WdOChk0e0OtnmmiLj0q3k3rI6Sqq",
            address: [
              "628dec55f18926db8f29d6df",
              "628ded5f1c6de05236aaffa2",
              "628dedbc9b9268bc9f0c2c8e",
              "628e0e03132cc004deeecc0a"
            ],
            status: "approved",
            dob: "2022-04-17T00:00:00.000Z",
            account_type: "user",
            createdAt: "2022-04-27T03:35:35.264Z",
            updatedAt: "2022-05-25T11:07:47.967Z",
            __v: 0
          },
          admin: {
            _id: "6297a882d8171ce2de578018",
            name: "Super Active",
            email: "admin@gmail.com",
            status: "active",
            number: "923335555555",
            password: "$2b$10$5fRRSSwgxuyr.sS21AqSzezk3ka9w2qKeAHZjRhyD5bvZERuEvy3e",
            createdAt: "2022-06-01T17:57:22.984Z",
            updatedAt: "2022-06-01T17:57:22.984Z"
          },
          message: "Hi, I am admin. How can i help you.",
          type: "admin",
          _id: "629f945bf6ca0017746e57fa",
          createdAt: "2022-06-07T18:09:31.552Z",
          updatedAt: "2022-06-07T18:09:31.552Z"
        }
      ],
      createdAt: "2022-06-07T17:28:37.010Z",
      updatedAt: "2022-06-07T18:09:31.553Z",
      __v: 1,
      acceptedAt: "2022-06-07T18:09:31.541Z",
      admin: {
        _id: "6297a882d8171ce2de578018",
        name: "Super Active",
        email: "admin@gmail.com",
        status: "active",
        number: "923335555555",
        password: "$2b$10$5fRRSSwgxuyr.sS21AqSzezk3ka9w2qKeAHZjRhyD5bvZERuEvy3e",
        createdAt: "2022-06-01T17:57:22.984Z",
        updatedAt: "2022-06-01T17:57:22.984Z"
      }
    },
    {
      _id: "629f8aa32419a81d1ff2eecd",
      user: {
        sellerStatus: "pending",
        _id: "6268ba07e3c4e3e6f7de6445",
        name: "Testing Dev",
        gender: "male",
        email: "erwerwrwrwr@gmail.com",
        password: "$2b$10$2AteQ4uNHnpARsbjOjH.Le/G6WdOChk0e0OtnmmiLj0q3k3rI6Sqq",
        address: [
          "628dec55f18926db8f29d6df",
          "628ded5f1c6de05236aaffa2",
          "628dedbc9b9268bc9f0c2c8e",
          "628e0e03132cc004deeecc0a"
        ],
        status: "approved",
        dob: "2022-04-17T00:00:00.000Z",
        account_type: "user",
        createdAt: "2022-04-27T03:35:35.264Z",
        updatedAt: "2022-05-25T11:07:47.967Z",
        __v: 0
      },
      reasonMessage: "order",
      status: "pending",
      chats: [],
      createdAt: "2022-06-07T17:28:03.582Z",
      updatedAt: "2022-06-07T17:28:03.582Z",
      __v: 0
    }
  ],
  status: false,
  typeKey: { label: "All", value: "all" },
  sortByKey: { label: "Desc", value: "desc" },
  paginate: null,
  paging: [],
  hasNextPage: true,
  currentPage: 1,
  hasPreviousPage: false,
};

const chatReducer = (state = initialState, action) => {
  const { payload, type } = action;

  switch (type) {
    case actionType.ALL_CHAT_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionType.ALL_CHAT_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        // chats: payload.request,
        paginate: payload.paginate,
        paging: payload.paginate.metadata.paging,
        hasNextPage: payload.paginate.metadata.hasNextPage,
        currentPage: payload.paginate.metadata.page.currentPage,
        hasPreviousPage: payload.paginate.metadata.hasPreviousPage,
        status: true,
      };

    case actionType.ALL_CHAT_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
        loading: false
      };

    case actionType.ACCEPT_CHAT_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
        status: false,
      };

    case actionType.ACCEPT_CHAT_REQUEST_SUCCESS:
      const updateData = state.chats.map((item) =>
        item._id === payload._id ? payload : item
      );
      return {
        ...state,
        loading: false,
        status: true,
        chats: updateData,
      };

    case actionType.ACCEPT_CHAT_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
        loading: false
      };

    // FILTERS
    case actionType.UPDATE_CHAT_SORT_BY_FILTER:
      return {
        ...state,
        sortByKey: payload,
      };

    case actionType.UPDATE_CHAT_TYPE_FILTER:
      return {
        ...state,
        typeKey: payload,
      };

    default:
      return state;
  }
};

export default chatReducer;
