
/**
 * Popup component renders a modal-like popup box with customizable content.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {React.ReactNode} props.content - The content to be displayed inside the popup.
 * @param {Function} props.handleClose - The function to be called when the close icon is clicked.
 *
 * @returns {JSX.Element} A popup box with the provided content and a close button.
 */
const Popup = props => {
  return (
    <div className="popup-box overlay">
      <div className="box">
        <span className="close-icon" onClick={props.handleClose}>x</span>
        {props.content}
      </div>
    </div>
  )
}

export default Popup
