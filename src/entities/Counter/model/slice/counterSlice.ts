import { CounterSchema } from '../types/counterSchema'
import { buildSlice } from '@/shared/lib/store'

const initialState: CounterSchema = {
  value: 0
}

export const counterSlice = buildSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    plusFive: (state) => {
      state.value = state.value + 5
    }
  }
})

// Action creators are generated for each case reducer function
export const {
  actions: counterActions,
  reducer: counterReducer,
  useActions: useCounterActions
} = counterSlice
