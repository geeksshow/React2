import { createClient } from "@supabase/supabase-js"


        const url = "https://hwpefbfrgalgrzkyzluu.supabase.co"
        const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3cGVmYmZyZ2FsZ3J6a3l6bHV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NDIwNzMsImV4cCI6MjA2NTQxODA3M30.NgqjmeURncGnwKNCORNGyfhAgmxfK4iCje3QZCL3Kyw"

        const supabase = createClient(url, key)

        export default function mediaUpload(file){

            const mediaUploadPromise = new Promise(
                (resole, reject)=>{
                    if(file == null){
                        reject("file is null")
                    }

                    const timestamp = new Date().getTime()
                    const fileName =  timestamp+file.name

                    supabase.storage.from('images').upload(fileName, file, {
                        upsert: false,
                        cacheControl: '3600'
                    
                    }).then(()=>{
                    
                        const publicUrl = supabase.storage.from('images').getPublicUrl(fileName)
                        resole(publicUrl.data.publicUrl)
                       
                       

                    }).catch((error)=>{
                        reject(error)
                    })

                }
            )

            return mediaUploadPromise

        }
    