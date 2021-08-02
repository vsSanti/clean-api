import { SurveyModel } from '@/domain/models';
import { AddSurvey, AddSurveyParams, LoadSurveys, LoadSurveyById } from '@/domain/usecases/survey';
import { mockSurveyModel, mockSurveyModels } from '@/domain/test';

export class AddSurveySpy implements AddSurvey {
  addSurveyParams: AddSurveyParams;

  async add (data: AddSurveyParams): Promise<void> {
    this.addSurveyParams = data;
    return Promise.resolve();
  }
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
  surveyModel = mockSurveyModel();
  id: string;

  async loadById (id: string): Promise<SurveyModel> {
    this.id = id;
    return Promise.resolve(this.surveyModel);
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  surveyModels = mockSurveyModels();
  callsCount = 0;

  async load (): Promise<SurveyModel[]> {
    this.callsCount += 1;
    return Promise.resolve(this.surveyModels);
  }
}
