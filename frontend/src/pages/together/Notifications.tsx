import { useEffect } from 'react'
import Sidebar from '../../components/together/Sidebar'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast';
import { formatTimestampToDifference } from '../../lib/utils';
import { IconFileCheck, IconHeartFilled, IconTrash, IconUserPlus } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading';

const Notifications = () => {
  const queryClient = useQueryClient();
  const { data:authUser } = useQuery<User>({ queryKey: ['authUser'] });
  const { data:notifications, isPending:isLoadingNotifications } = useQuery<NotificationType[]>({ queryKey: ['notifications'] });


  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  },[]);

  //  clear all notifiations
  const { mutate:clearNotifications, isPending:clearingNotifications } = useMutation({
    mutationFn: async () => {
      try {
        const response = await fetch('/api/together/notifications/all', {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (!response.ok) { 
          throw new Error(data.message);
        }

        return data;
      } catch (error) {
        throw new Error((error as Error).message);
      }
    },
    onSuccess: () => {
      toast.success("Notificatons Cleared");
      queryClient.invalidateQueries({ queryKey: ['notifications']} );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong" );
    }
  });

  // mark all notifications as read
  const { mutate:markAllRead, isPending:markingAllRead } = useMutation({
    mutationFn: async () => {
      try {
        const response = await fetch('/api/together/notifications/all/read', {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Something went wrong"); 
        }

        // Mark all
        notifications?.forEach((notification) => {
          notification.seen = 1;
        });

        return data;

      } catch (error) {
        throw new Error((error as Error).message);
      }
    }, 
    onSuccess: () => {
      toast.success("All notifications marked as read");
    },
    onError: async (error: Error) => {
      toast.error(error.message || "Something went wrong");
    }
  })

  return (
    <div className='flex justify-center bg-white dark:bg-darkbg min-h-screen'>
      <Sidebar />

      <div className="w-[40rem] mt-24 flex flex-col gap-4 dark:text-darktext">
          <h4 className="text-primary text-3xl pb-4 border-b-primary border-b-2">{authUser?.username}'s Notifications</h4>
          <div className="flex gap-4 w-full justify-end">
            {!markingAllRead && <button onClick={() => markAllRead()} className="text-primary flex gap-2"><IconFileCheck />  Mark all Read</button>}
            {markingAllRead && <Loading size="md" cn="text-primary" />}

            {!clearingNotifications && <button onClick={() => clearNotifications()} className="text-red-500 flex gap-2"><IconTrash />  Clear Notifications</button>}
            {clearingNotifications && <Loading size="md" cn="text-primary" />}
          </div>

          <div className="flex flex-col gap-4 pb-24">
            {notifications && !isLoadingNotifications && notifications.map((notification) => (
              <div className="flex gap-2 items-center">
                {!notification.seen && <div className='w-3 h-3 bg-primary rounded-full'/>}
                <p className="text-gray-400 italic">{formatTimestampToDifference(notification.timestamp)} - </p>
                {notification.type === "follow" && 
                  <p className="flex"><IconUserPlus /> - <Link to={`/together/users/${notification.sender_username}`} className='hover:text-primary cursor-pointer hover:underline'>{notification.sender_username} has followed you!</Link> </p>
                }
                {notification.type === "like" && 
                  <p className="flex"><IconHeartFilled /> - <Link to={`/together/users/${notification.sender_username}`} className='hover:text-primary cursor-pointer hover:underline'>{notification.sender_username} has liked your post!</Link> </p>
                }
              </div>
            ))}
            {isLoadingNotifications && <Loading size="lg" cn='text-primary' />}
          </div>

      </div>
    </div>
  )
}

export default Notifications