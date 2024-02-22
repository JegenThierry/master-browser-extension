import { API_URL } from "@/models/constants";
import axios from "axios";

class QuestionnaireService {
    private baseUrl = `${API_URL}/Questionnaire`;

    public async hasUnansweredQuestionnaireGroup(userId:string): Promise<boolean> {
        let url = this.baseUrl;
        url += `/hasUnansweredQuestionnaire`;
        url += `?userId=${encodeURIComponent(userId)}`;

        const res = await axios.get(url);
        console.log("HasUnansweredQuestionnaires", JSON.stringify(res.data, null, 2));

        if(res.data === undefined) return false;
        return res.data;
    }

    public async getActiveQuestionnaireGroupUrl(userId:string): Promise<string> {
        let url = this.baseUrl;
        url += `?userId=${encodeURIComponent(userId)}`;

        const res = await axios.get(url);
        console.log("getActiveQuestionnaireGroupUrl", JSON.stringify(res.data, null, 2));

        if(res.data === undefined) return "";
        return res.data.urlExtension;
    }
}

export default new QuestionnaireService();