import FastPassResources from "./FastPassResources.jsx";
import TemplateAnswerGeneric from "./TemplateAnswerGeneric.jsx";
import answer from "../jsonData/answer.json"
import answer2 from "../jsonData/answer2.json"
import answer3 from "../jsonData/answer3.json"
const CopyManager = ()=> {
    return(
        <div>
            <TemplateAnswerGeneric data={answer} includeDate={true}/>
            <TemplateAnswerGeneric data={answer2}/>
            <TemplateAnswerGeneric data={answer3}/>
            <FastPassResources/>
        </div>
    )
}

export default CopyManager;