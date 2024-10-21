// Loading Spinner

const Loading = ({size, cn}: {size:string; cn?:string}) => {
  switch (size) {
    case 'xs':
      return <XSLoading cn={cn} />
    case 'sm':
      return <SMLoading cn={cn} />
    case 'md':
      return <MDLoading cn={cn} />
    case 'lg':
      return <LGLoading cn={cn} />
    default:
      return <XSLoading cn={cn} />
  }
}

const XSLoading = ({cn}: {cn?:string}) => {
  return (
    <span className={`loading loading-dots loading-xs text-center ${cn}`}></span>
  );
}

const SMLoading = ({cn}: {cn?:string}) => {
  return (
    <span className={`loading loading-dots loading-sm text-center ${cn}`}></span>
  )
}

const MDLoading = ({cn}: {cn?:string}) => {
  return (
    <span className={`loading loading-dots loading-md text-center ${cn}`}></span>
  )
}

const LGLoading = ({cn}: {cn?:string}) => {
  return (
    <span className={`loading loading-dots loading-lg text-center ${cn}`}></span>
  )
}

export default Loading