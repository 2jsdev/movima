import { inject } from 'inversify';
import { Request, Response } from 'express';
import { controller, httpPost } from 'inversify-express-utils';
import { BaseController } from '../../../../../Shared/infrastructure/http/api/models/BaseController';
import { UploadFilesRequestDTO } from '../../../../application/useCases/uploadFiles/UploadFilesRequestDTO';
import { FileMapper } from '../../../persistence/sequelize/FileMapper';
import { TYPES } from '../../../constants/types';
import upload from '../../../config/multer';

@controller('/api/files')
export class UploadFileController extends BaseController {
  constructor(@inject(TYPES.UploadFilesUseCase) private useCase) {
    super();
  }
  @httpPost('/:collectionIdOrName/:recordId', upload.array('files', 10))
  async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      const uploadFilesRequestDTO: UploadFilesRequestDTO = {
        files: req.files,
        collectionIdOrName: req.params.collectionIdOrName,
        recordId: req.params.recordId,
      } as UploadFilesRequestDTO;

      const result = await this.useCase.execute(uploadFilesRequestDTO);

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue().message);
      } else {
        const files = result.value.getValue();
        return this.ok(res, { files: files.map((file) => FileMapper.toDTO(file)) });
      }
    } catch (error) {
      return this.fail(res, error);
    }
  }
}
