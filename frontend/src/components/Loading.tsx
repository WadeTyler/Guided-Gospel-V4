// Loading Spinner

const Loading = ({size}: {size:string}) => {
  switch (size) {
    case 'xs':
      return <XSLoading />
    case 'sm':
      return <SMLoading />
    case 'md':
      return <MDLoading />
    case 'lg':
      return <LGLoading />
    default:
      return <XSLoading />
  }
}

const XSLoading = () => {
  return (
    <span className="loading loading-dots loading-xs text-center"></span>
  );
}

const SMLoading = () => {
  return (
    <span className="loading loading-dots loading-sm text-center"></span>
  )
}

const MDLoading = () => {
  return (
    <span className="loading loading-dots loading-md text-center"></span>
  )
}

const LGLoading = () => {
  return (
    <span className="loading loading-dots loading-lg text-center"></span>
  )
}

export default Loading