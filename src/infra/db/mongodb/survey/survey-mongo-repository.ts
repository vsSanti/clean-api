import { ObjectId } from 'mongodb';

import { MongoHelper } from '@/infra/db/mongodb/helpers';
import { SurveyModel } from '@/domain/models';
import { AddSurveyParams } from '@/domain/usecases/survey';
import { AddSurveyRepository, LoadSurveyByIdRepository, LoadSurveysRepository } from '@/data/protocols/db/survey';

export class SurveyMongoRepository implements
  AddSurveyRepository,
  LoadSurveysRepository,
  LoadSurveyByIdRepository {
  async add (data: AddSurveyParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.insertOne(data);
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const surveys = await surveyCollection.find().toArray();
    return MongoHelper.mapCollection<SurveyModel>(surveys);
  }

  async loadById (id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys');

    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) });

    return survey && MongoHelper.map<SurveyModel>(survey);
  }
}
