import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { PromptTemplate } from "@langchain/core/prompts"
import dotenv from "dotenv"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { RunnableParallel } from "@langchain/core/runnables";

dotenv.config();

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite"
})

const parser = new StringOutputParser()

const prompt1 = PromptTemplate.fromTemplate('Generate short and simple notes from the following text \n {text}')


const prompt2 = PromptTemplate.fromTemplate('Generate 5 short question answers from the following text \n {text}')

const prompt3 = PromptTemplate.fromTemplate('Merge the provided notes and quiz into a single document \n notes -> {notes} and quiz -> {quiz}')


const parallelChain = RunnableParallel.from({
    notes: prompt1.pipe(model).pipe(parser),
    quiz: prompt2.pipe(model).pipe(parser),

})

const mergeChain = prompt3.pipe(model).pipe(parser)

const finalChain = parallelChain.pipe(mergeChain);

const text = `Love is an emotion involving strong attraction, affection, emotional attachment or concern for a person, animal, or thing.[1] It is expressed in many forms, encompassing a range of strong and positive emotional and mental states, from the most sublime virtue, good habit, deepest interpersonal affection, to the simplest pleasure.[2] An example of this range of meanings is that the love of a mother differs from the love of a spouse, which, in turn, differs from the love of food.

Love is considered to be both positive and negative, with its virtue representing kindness, compassion, and affection—"the unselfish, loyal, and benevolent concern for the good of another"—and its vice representing a moral flaw akin to vanity, selfishness, amour-propre, and egotism.[citation needed] It may also describe compassionate and affectionate actions towards other humans, oneself, or animals.[3] In its various forms, love acts as a major facilitator of interpersonal relationships, and owing to its central psychological importance, is one of the most common themes in the creative arts.[4][5] Love has been postulated to be a function that keeps human beings together against menaces and to facilitate the continuation of the species.[6]

Ancient Greek philosophers identified six forms of love: familial love (storge), friendly love or platonic love (philia), romantic love (eros), self-love (philautia), guest love (xenia), and divine or unconditional love (agape). Modern authors have distinguished further varieties of love: fatuous love, unrequited love, empty love, companionate love, consummate love, compassionate love, infatuated love (passionate love or limerence), obsessive love, amour de soi, and courtly love. Numerous cultures have also distinguished Ren, Yuanfen, Mamihlapinatapai, Cafuné, Kama, Bhakti, Mettā, Ishq, Chesed, Amore, charity, Saudade (and other variants or symbioses of these states), as culturally unique words, definitions, or expressions of love in regard to specified "moments" currently lacking in the English language.[7]

The triangular theory of love suggests intimacy,[i] passion,[ii] and commitment[iii] are core components of love.[8] Love has additional religious or spiritual meaning. This diversity of uses and meanings, combined with the complexity of the feelings involved, makes love unusually difficult to consistently define, compared to other emotional states`

const result = await finalChain.invoke({
    text: text
})


console.log(result)



