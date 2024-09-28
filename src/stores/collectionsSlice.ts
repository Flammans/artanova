import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { api } from '../utils/api.ts'
import { AxiosResponse } from 'axios'
import { AppDispatch, RootState } from './store.ts'

interface CollectionsState {
  collections: Collection[]
}

interface Collection {
  id: number
  uuid: string
  userId: number
  title: string
}

const initialState: CollectionsState = {
  collections: [],
}

const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    setCollections: (state, action: PayloadAction<CollectionsState>) => {
      state.collections = action.payload.collections
    },
    clearCollections: (state) => {
      state.collections = []
    },
  },
})

export const { setCollections, clearCollections } = collectionsSlice.actions

export default collectionsSlice.reducer

// Fetch collections action creator
export function fetchCollections () {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const { token } = getState().user // Get user from state instead of using useAppSelector
    const response: AxiosResponse<Collection[]> = await api.get('/collections', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    dispatch(setCollections({ collections: response.data }))
  }
}

// Create collection action creator
export function createCollection (title: string) {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const { token } = getState().user // Get user token from state
    await api.post(
      '/collections',
      { title },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    await dispatch(fetchCollections()) // Fetch collections after creation
  }
}

// Add artwork to collection action creator
export function addArtworkToCollection (collectionUuid: string, artworkId: number) {
  return async (_dispatch: AppDispatch, getState: () => RootState) => {
    const { token } = getState().user // Get user token from state
    await api.post(
      `/collections/${collectionUuid}`,
      { artworkId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  }
}

// Delete collection action creator
export function deleteCollection (collectionUuid: string) {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const { token } = getState().user // Get user token from state
    await api.delete(`/collections/${collectionUuid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    await dispatch(fetchCollections()) // Fetch collections after deletion
  }
}

// Delete element from collection action creator
export function deleteElementFromCollection (collectionUuid: string, artworkId: number) {
  return async (_dispatch: AppDispatch, getState: () => RootState) => {
    const { token } = getState().user // Get user token from state
    await api.delete(`/collections/${collectionUuid}/artworks/${artworkId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }
}