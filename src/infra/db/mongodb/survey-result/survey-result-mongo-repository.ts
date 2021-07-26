import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { SurveyResultModel } from '@/domain/models';
import { SaveSurveyResultModel } from '@/domain/usecases';
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey';

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('survey-results');
    const res = await surveyResultCollection.findOneAndUpdate({
      surveyId: data.surveyId,
      accountId: data.accountId,
    }, {
      $set: {
        answer: data.answer,
        date: data.date,
      },
    }, {
      upsert: true,
      returnDocument: 'after',
    });

    return res.value && MongoHelper.map<SurveyResultModel>(res.value);
  }
}
