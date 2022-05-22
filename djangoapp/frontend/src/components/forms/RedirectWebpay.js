import React from 'react'

export default function RedirectWebpay(token, url) {
  return (
    <form action={bookingDetails.url}>
        <input type="hidden" name="token_ws" value={bookingDetails.token}/>
        <input type="submit" value="Pagar" />
    </form>
  )
}
