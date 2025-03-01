import {GoogleGenerativeAI} from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({
    model : 'gemini-1.5-flash'
})

export const aiSummariseCommit = async(diff:string) => {
    const response = await model.generateContent([
        `Indo-Persian culture refers to a cultural synthesis 
        present on the Indian subcontinent.[1] It is characterised 
        by the absorption or integration of Persian 
        aspects into the various cultures of modern-day republics
         of Bangladesh, India, and Pakistan. The earliest introduction
          of Persian influence and culture to the subcontinent was by 
          various Muslim Turko-Persian rulers, such as the 11th-century
           Sultan Mahmud Ghaznavi, rapidly pushed for the heavy 
           Persianization of conquered territories in northwestern 
           Indian subcontinent, where Islamic influence was also firmly 
           established. This socio-cultural synthesis arose steadily
            through the Delhi Sultanate from the 13th to 16th centuries
            , and the Mughal Empire from then onwards until the 19th century.[2]
             Various dynasties of Turkic, Iranian and local Indian origin 
             patronized the Persian language and contributed to the development
              of a Persian culture in India.[3] The Delhi Sultanate developed
               their own cultural and political identity which built upon Persian
                and Indic languages, literature and arts, which formed 
                the basis of an Indo-Muslim civilization.[4]\n\n${diff}`
    ]);


    return response.response.text();
}