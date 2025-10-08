'use client'

import {useRouter} from "next/navigation"
import useSubscribeModal from "@/hooks/useSubscribeModal"
import { useUser } from "@/hooks/useUser"
import { useState, useEffect } from "react"
import { postData } from "@/libs/helpers"
import { toast } from "react-hot-toast"
import Button from "@/components/Button"

const AccountContent = () => {
  const router = useRouter()
  const subscribeModal = useSubscribeModal()
  const { user, isLoading, subscription } = useUser()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if(!isLoading && !user) {
      router.replace('/')
    }
  }, [user, router, isLoading])

  const redirectToCustomerPortal = async () => {
    setLoading(true)
    try {
      const { url, error } = await postData({
        url: '/api/create-portal-link',
      })
      window.location.assign(url)
    } catch (error) {
      if(error) {
        toast.error((error as Error).message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-7 px-6">
     {!subscription && (
      <div className="flex flex-col gap-y-4">
        <p>No active plan.</p>
        <Button className="w-[300px]" onClick={subscribeModal.onOpen}>
          Subscribe
        </Button>
      </div>
     )}
     {subscription && (
      <div className="flex flex-col gap-y-4">
        <p>You are currently on the <b>{subscription?.prices?.products?.name}</b> plan.</p>
        <Button className="w-[300px]" disabled={loading || isLoading} onClick={redirectToCustomerPortal}>
          Open Customer Portal
        </Button>
      </div>
     )}
    </div>
  )
}

export default AccountContent