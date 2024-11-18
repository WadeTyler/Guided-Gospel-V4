import MessagesSidebar from "../../components/together/MessagesSidebar"
import Sidebar from "../../components/together/Sidebar"



const Messages = () => {
  return (
    <div className='flex justify-center bg-white dark:bg-darkbg min-h-screen'>
      <Sidebar />

      <div className="w-[40rem] mt-24 flex flex-col gap-4 dark:text-darktext">
        
      </div>

      <MessagesSidebar />
    </div>
  )
}

export default Messages