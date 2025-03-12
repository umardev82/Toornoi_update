import React from 'react'

const LegalInformation = () => {
  return (
    <>
    <div className="bg-gradient-to-b from-[#060606]  to-[#031d29] flex sm:items-end items-center py-24 px-5 h-[70vh]">
                       <div className="container md:w-[80%] w-full mx-auto ">
                           <div className="">
                               <div className=" my-auto">
                                   <div className="landing-content">
                                       
                                           <h1 className="text-white sm:text-4xl text-3xl sm:text-left text-center lemon-milk-font font-semibold lemon-milk-font mb-5">Legal Information</h1>
                                       <h6 className='text-white  sm:text-left text-center lemon-milk-font font-semibold lemon-milk-font'>Legal Information for Toornoi</h6>
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>
   <div className='bg-(--secondarybg)  text-(--textwhite) '>
     <div className='bg-black container md:p-8 md:w-[80%] w-full p-5 mx-auto'>

   <h1 className=' font-semibold  mb-5'>Welcome to Toornoi. Below, you will find the legal information related to our platform, ensuring
   transparency and compliance with applicable regulations.</h1>

   <h2 className=' font-semibold lemon-milk-font my-5'>1. Website Publisher</h2>
   <ul>
       <li>- <b>Company Name:</b> Toornoi - EB Digitech</li>
       <li>- <b>Legal Status:</b> EI</li>
       <li>- <b>Registered Address:</b> 7 rue anatole de la Forge 75017 Paris</li>
       <li>- <b>Registration Number:</b> 940 601 305</li>
       <li>- <b>Contact Email:</b> contact@toornoi.com</li>
   </ul>

   <h2 className=' font-semibold lemon-milk-font my-5'>2. Website Host</h2>
   
   <ul>
       <li>- <b>Hosting Provider:</b> AWS</li>
       <li>- <b>Registered Address:</b> 440 Terry Ave N, Seattle, WA, US</li>
       <li>- <b>Contact Email:</b> contact@aws.com</li>
      
   </ul>

   <h2 className='font-semibold lemon-milk-font my-5'>3. Intellectual Property</h2>

   <p>All content on Toornoi, including logos, text, images, and trademarks, is protected by intellectual
   property laws. Any unauthorized reproduction, modification, or distribution is strictly prohibited.</p>


   <h2 className=' font-semibold lemon-milk-font my-5'>4. Personal Data Protection</h2>
   <p>Toornoi complies with data protection regulations, including the General Data Protection
Regulation (GDPR). We collect and process user data only for necessary purposes, such as
account management, tournament organization, and platform security.</p>
<p>Users have the right to:</p>
   <ul>
       <li>- Access their personal data</li>
       <li>- Request corrections or deletions</li>
       <li>- Withdraw consent for data processing</li>
       <li>- File complaints with the relevant data protection authority</li>
   </ul>
   <p>For more details, please refer to our Privacy Policy.</p>


   <h2 className=' font-semibold lemon-milk-font my-5'>5. Liability Disclaimer</h2>
   <ul>
       <li>- Toornoi is not responsible for any technical failures, data loss, or connectivity issues
       experienced by users.</li>
       <li>- We do not guarantee uninterrupted access to the platform and reserve the right to make
       changes or suspend services at any time.</li>
       <li>- Users are solely responsible for their actions on the platform, including compliance with
       tournament rules and fair play policies.</li>
   </ul>
   <h2 className=' font-semibold lemon-milk-font my-5'>6. Governing Law & Jurisdiction</h2>
  <p>These legal terms are governed by the laws of France. Any disputes arising from the use of
  Toornoi shall be subject to the exclusive jurisdiction of the courts of France.</p>
   <h2 className=' font-semibold lemon-milk-font my-5'>7. Contact Information</h2>
    
       <p>For any legal inquiries or concerns, you can contact us at: 📧 contact@toornoi.com
       📍 7 rue Anatole de la Forge 75017 Paris</p>
       <p>By using Toornoi, you acknowledge and accept the legal information outlined above.</p>
   
  
   </div>
   </div>
   </>
  )
}

export default LegalInformation