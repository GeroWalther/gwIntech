import React from "react";
import {
  ApolloLogo,
  CSSLogo,
  GQLLogo,
  HTMLLogo,
  JSLogo,
  MongoDBLogo,
  NextLogo,
  NodeLogo,
  PlanetScaleLogo,
  PrismaLogo,
  ReactLogo,
  ReactNativeLogo,
  ReactQueryLogo,
  ReduxLogo,
  SassLogo,
  TRPCLogo,
  TSLogo,
  TWCSS,
  ZodLogo,
} from "./Icons";

export const SkillsLogos = () => {
  return (
    <div className="mb-8">
      <h3 className="text-3xl py-5 mt-8 mb-6  lg:text-lg  md:py-2 ">
        Languages, Frameworks and Technologies I am working with
      </h3>

      <div className="grid w-full xs:grid-cols-6  grid-cols-10 gap-1 items-center">
        <HTMLLogo />
        <CSSLogo />
        <JSLogo />
        <TSLogo />
        <NodeLogo />
        <ReactLogo />
        <NextLogo />
        <ReactNativeLogo />
        <ReduxLogo />
        <TWCSS />
        <SassLogo />
        <GQLLogo />
        <ApolloLogo />
        <ZodLogo />
        <TRPCLogo />
        <ReactQueryLogo />
        <PrismaLogo />
        <PlanetScaleLogo />
        <MongoDBLogo />
      </div>
    </div>
  );
};
