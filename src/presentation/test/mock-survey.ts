import { SurveyModel } from '@/domain/models';
import { AddSurvey, AddSurveyParams, LoadSurveys, LoadSurveyById } from '@/domain/usecases/survey';
import { mockSurveyModel, mockSurveyModels } from '@/domain/test';

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyParams): Promise<void> {
      return null;
    }
  }

  return new AddSurveyStub();
};

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return mockSurveyModel();
    }
  }

  return new LoadSurveyByIdStub();
};

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return Promise.resolve(mockSurveyModels());
    }
  }

  return new LoadSurveysStub();
};
