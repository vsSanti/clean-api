import { LoadSurveys } from '../../../domain/usecases';
import { SurveyModel } from '../../../domain/models';
import { LoadSurveysRepository } from '../../protocols/db/survey';

export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly loadSurveysRepository: LoadSurveysRepository) { }

  async load (): Promise<SurveyModel[]> {
    await this.loadSurveysRepository.loadAll();
    return null;
  }
}
