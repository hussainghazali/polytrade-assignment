import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { FilesModule } from "./files/files.module";
import { SubscriptionsModule } from "./subscriptions/subscriptions.module";
import { MagazinesModule } from "./magazines/magazines.module";
import { LogsModule } from "./logs/logs.module";
import { NotFoundExceptionFilter } from "./logs/error/404";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { BadRequestFilter } from "./logs/error/400";
import { CreatedInterceptor } from "./logs/error/201";
import { ServerErrorFilter } from "./logs/error/500";
import { SuccessFilter } from "./logs/error/200";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      port: 5432,
      database: process.env.POSTGRES_DB,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
      // ssl: true, // Enable only for production database connection
      // extra: {
      //   ssl: {
      //     rejectUnauthorized: false, // false only for production database connection
      //   },
      // },
    }),
    UsersModule,
    AuthModule,
    FilesModule,
    SubscriptionsModule,
    MagazinesModule,
    LogsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter, 
    },
    {
      provide: APP_FILTER,
      useClass: BadRequestFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CreatedInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ServerErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: SuccessFilter,
    },
  ],
})
export class AppModule {}
