import { HttpService } from '@nestjs/axios';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

@Controller()
@ApiTags('app')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/external-api-rxjs')
  getObservable(): Observable<AxiosResponse<any>> {
    //? All HttpService methods return an AxiosResponse wrapped in an Observable object.
    return this.httpService.get('https://jsonplaceholder.typicode.com/todos/1');
  }

  @Get('/external-api-promise')
  getPromise(): Promise<AxiosResponse<any>> {
    //? If you think that HttpModule.register's options are not enough for you
    //? or if you just want to access the underlying Axios instance created
    //? by @nestjs/axios, you can access it via HttpService#axiosRef as follows:
    return this.httpService.axiosRef.get(
      'https://jsonplaceholder.typicode.com/todos/1'
    );
  }
}
