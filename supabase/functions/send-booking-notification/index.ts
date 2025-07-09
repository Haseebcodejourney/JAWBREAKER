
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  bookingId: string;
  type: 'confirmation' | 'reminder' | 'cancellation';
  recipientEmail: string;
  patientName: string;
  clinicName: string;
  treatmentName: string;
  appointmentDate: string;
  appointmentTime: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      bookingId,
      type,
      recipientEmail,
      patientName,
      clinicName,
      treatmentName,
      appointmentDate,
      appointmentTime
    }: NotificationRequest = await req.json();

    let subject = "";
    let htmlContent = "";

    switch (type) {
      case 'confirmation':
        subject = `Booking Confirmation - ${treatmentName}`;
        htmlContent = `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <h1 style="color: #2563eb;">Booking Confirmed!</h1>
            <p>Dear ${patientName},</p>
            <p>Your medical appointment has been successfully booked. Here are the details:</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1e40af;">Appointment Details</h3>
              <p><strong>Treatment:</strong> ${treatmentName}</p>
              <p><strong>Clinic:</strong> ${clinicName}</p>
              <p><strong>Date:</strong> ${appointmentDate}</p>
              <p><strong>Time:</strong> ${appointmentTime}</p>
              <p><strong>Booking ID:</strong> ${bookingId}</p>
            </div>
            
            <h3 style="color: #1e40af;">What's Next?</h3>
            <ul>
              <li>The clinic will contact you within 24 hours to confirm your appointment</li>
              <li>Please prepare any required medical documents</li>
              <li>You'll receive a reminder 24 hours before your appointment</li>
            </ul>
            
            <p>If you have any questions, please contact us or the clinic directly.</p>
            <p>Best regards,<br>Medical Tourism Platform Team</p>
          </div>
        `;
        break;
        
      case 'reminder':
        subject = `Appointment Reminder - Tomorrow at ${appointmentTime}`;
        htmlContent = `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <h1 style="color: #dc2626;">Appointment Reminder</h1>
            <p>Dear ${patientName},</p>
            <p>This is a reminder that you have an appointment tomorrow:</p>
            
            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <h3 style="margin-top: 0; color: #dc2626;">Tomorrow's Appointment</h3>
              <p><strong>Treatment:</strong> ${treatmentName}</p>
              <p><strong>Clinic:</strong> ${clinicName}</p>
              <p><strong>Date:</strong> ${appointmentDate}</p>
              <p><strong>Time:</strong> ${appointmentTime}</p>
            </div>
            
            <h3 style="color: #dc2626;">Important Reminders</h3>
            <ul>
              <li>Arrive 15 minutes early for check-in</li>
              <li>Bring your ID and insurance documents</li>
              <li>Follow any pre-treatment instructions provided</li>
            </ul>
            
            <p>Looking forward to seeing you tomorrow!</p>
            <p>Best regards,<br>${clinicName}</p>
          </div>
        `;
        break;
        
      case 'cancellation':
        subject = `Appointment Cancelled - ${treatmentName}`;
        htmlContent = `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <h1 style="color: #dc2626;">Appointment Cancelled</h1>
            <p>Dear ${patientName},</p>
            <p>Your appointment has been cancelled:</p>
            
            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Cancelled Appointment</h3>
              <p><strong>Treatment:</strong> ${treatmentName}</p>
              <p><strong>Clinic:</strong> ${clinicName}</p>
              <p><strong>Date:</strong> ${appointmentDate}</p>
              <p><strong>Time:</strong> ${appointmentTime}</p>
            </div>
            
            <p>If you'd like to reschedule, please contact us or book a new appointment through our platform.</p>
            <p>Best regards,<br>Medical Tourism Platform Team</p>
          </div>
        `;
        break;
    }

    const emailResponse = await resend.emails.send({
      from: "Medical Tourism <noreply@medicaltourism.com>",
      to: [recipientEmail],
      subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
