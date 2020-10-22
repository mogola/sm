const InputUrl = ({url, ref, onClick, onChange, ...rest}) => {
  return (
    <div>
      <span className="sub-label">Url :</span>
      <input defaultValue={url} onChange={onChange} type="text" {...rest} />
    </div>
  )
}

const InputValue = ({value, ref, onClick, onChange, ...rest}) => {
  return (
    <div>
        <span className="sub-label">Name :</span>
        <input defaultValue={value} onChange={onChange} type="text" {...rest} />
      </div>
    )
}

const Input = ({value, url, i_name, i_url, refUrl, refValue, onClick, onChange, ...rest}) => {
    return(
      <div className="field field-social">
        <label className="label-field">{value} :</label>
        <div className="field-flex">
          <InputValue i_name={i_name} defaultValue={value} onChange={onChange} type="text" {...rest}/>
          <InputUrl i_url={i_url} defaultValue={url} onChange={onChange} type="text" {...rest}/>
          <div>
            <a className="delete-field"
            onClick={onClick}>Supprimer</a>
          </div>
        </div>
      </div>
    )
  }

  export default Input