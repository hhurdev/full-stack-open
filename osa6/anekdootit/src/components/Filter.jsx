import { useDispatch } from "react-redux"
import { filterChange } from "../reducers/filterReducer"


const Filter = () => {
  const dispatch = useDispatch()
  const handleChange = (event) => {
    console.log(event.target.value)
    const filter = event.target.value
    dispatch(filterChange(filter))
  }

  const style = {
    marginBottom: 10,
    backgroundColor: '#FFD5C0',
    padding: 10,
    borderRadius: 5
  }

  return (
    <div style={style}>
      Filter the anecdotes <input onChange={handleChange} />
    </div>
  )
}

export default Filter