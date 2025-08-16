import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetBookByIdRequest {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
