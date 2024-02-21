//controlador o manejador de archivos para la peticion
import { procesarArchivo } from "../utils/archivoLangchain.js";
import { OpenAI } from 'openai';

//codigo configuracion de la ruta subirArchivo
export const subirArchivo = async (req, res) => {
    res.setHeader("Content-Type", "applicaton/json")
    if (!req.file) {
        res.status(400).send({ message: 'No hay ningún archivo PDF.' });
    }
    if (!req.body.question) {
        res.status(400).send({ message: 'No  hay ninguna pregunta.' });
    }
    //llamar al codigo para configurar el archivo
    const text = await procesarArchivo(
       
        `${req.file?.filename}`,
        req.body.question
    )
    console.log("Respuesta: ",text)
    //resivo estado correcto
    res.status(200).send({ message: text });


}
const openai = new OpenAI();
export const orderAI = async (req, res) => {

    const { prompt } = req.body

    console.log(prompt)
    const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: "user",
                content: `Tu tienes un rol de contador de vocales y requiero que cuentes las vocales de este texto: ${prompt}`
            }
        ],
        temperature: 0.1
    })

    // @ts-ignore
    res.send(completion.choices[0].message.content)

}