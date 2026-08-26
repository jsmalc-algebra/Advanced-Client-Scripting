export const initialState = {
    limit: 10,
    currPage: 1,
    sortBy: null,
    sortOrder: null,
    searchMode: false,
    searchString: '',
};

export function tableStateReducer(state, action) {
    switch (action.type) {
        case 'SET_LIMIT':
            return {
                ...state,
                limit: action.payload,
                currPage: 1
            };

        case 'SET_PAGE':
            return {
                ...state,
                currPage: action.payload
            };

        case 'SORT':
            if (state.searchMode) return state; // Still have it so searching and sorting can't happen at the same time
            if (state.sortBy !== action.payload) {
                return {
                    ...state,
                    sortBy: action.payload,
                    sortOrder: 'asc', currPage: 1
                };
            }
            return {
                ...state,
                sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc',
                currPage: 1
            };

        case 'SEARCH':
            return {
                ...state,
                searchString: action.payload,
                searchMode: true,
                sortBy: null,
                sortOrder: null,
                currPage: 1,
            };

        case 'CLEAR_SEARCH':
            return {
                ...state,
                searchString: '',
                searchMode: false,
                currPage: 1
            };

        default:
            return state;
    }
}