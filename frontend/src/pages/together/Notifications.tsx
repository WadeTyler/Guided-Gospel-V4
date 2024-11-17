import React, { useEffect } from 'react'
import Sidebar from '../../components/together/Sidebar'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast';
import { formatTimestamp, formatTimestampToDifference } from '../../lib/utils';
import { IconFriendsOff, IconHeartFilled, IconTrash, IconUserPlus } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading';

const Notifications = () => {
  const queryClient = useQueryClient();
  const { data:authUser } = useQuery<User>({ queryKey: ['authUser'] });

  const { data:notifications, isPending } = useQuery<NotificationType[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        const response = await fetch("/api/together/notifications/all", {
          method: "GET",
          headers: {
            "Content-Type": "applicaton/json",
          },
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.message);
        console.log(data);
        return data;
      } catch (error) {
        toast.error((error as Error).message || "Something went wrong");
      }
    }
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['notificatons'] });
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
  })

  return (
    <div className='flex justify-center bg-white dark:bg-darkbg min-h-screen'>
      <Sidebar />

      <div className="w-[40rem] mt-24 flex flex-col gap-4 dark:text-darktext">
          <h4 className="text-primary text-3xl pb-4 border-b-primary border-b-2">{authUser?.username}'s Notifications</h4>
          <div className="flex gap-4 w-full justify-end">
            {!clearingNotifications && <button onClick={() => clearNotifications()} className="text-red-500 flex gap-2"><IconTrash />  Clear Notifications</button>}
            {clearingNotifications && <Loading size="md" cn="text-primary" />}
          </div>

          <div className="flex flex-col gap-4 pb-24">
            {notifications && notifications.map((notification) => (
              <div className="">
                {notification.type === "follow" && 
                  <p className="flex">{formatTimestampToDifference(notification.timestamp)} - <IconUserPlus /> - <Link to={`/together/users/${notification.sender_username}`} className='hover:text-primary cursor-pointer hover:underline'>{notification.sender_username} has followed you!</Link> </p>
                }
                {notification.type === "like" && 
                  <p className="flex">{formatTimestampToDifference(notification.timestamp)} - <IconHeartFilled /> - <Link to={`/together/users/${notification.sender_username}`} className='hover:text-primary cursor-pointer hover:underline'>{notification.sender_username} has liked your post!</Link> </p>
                }
              </div>
            ))}
          </div>

      </div>
    </div>
  )
}

export default Notifications