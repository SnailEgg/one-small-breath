const ErrorMessage = ({ message }) => {
    return (
        <>
        {
            message
            ? <div className="pb-2">
                <p className="w-full overflow-x-hidden">################################################################################</p>
                <p>{message}</p>
                <p className="w-full overflow-x-hidden">################################################################################</p>
              </div>
            : ''
        }
        </>
    )
}

export default ErrorMessage;