'use server'

import FormSubmissionEmail from "@/emails/formSubmission"
import { Resend } from 'resend'


const sendEmail = async formData => {
    const name = formData.get('name')
  
    const resend = new Resend(process.env.RESEND_API_KEY)
  
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', 
      to: 'your-email@example.com',
      subject: 'Welcome to Resend!',
      react: <FormSubmissionEmail name={name} />,
    })
  
    if (error) {
      console.error(error)
      return { success: false }
    }
  
    console.log(data)
    return { success: true }
  }
  
  export default sendEmail