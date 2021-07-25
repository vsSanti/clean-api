import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { SurveyModel } from '@/domain/models';
import { AddSurveyModel } from '@/domain/usecases';
import { AddSurveyRepository, LoadSurveysRepository } from '@/data/protocols/db/survey';

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.insertOne(surveyData);
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const surveys = await surveyCollection.find().toArray();
    return surveys;
  }
}
