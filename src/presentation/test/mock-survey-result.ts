import { SurveyResultModel } from '@/domain/models';
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases/survey-result';
import { mockSurveyResultModel } from '@/domain/test';

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return mockSurveyResultModel();
    }
  }

  return new SaveSurveyResultStub();
};
