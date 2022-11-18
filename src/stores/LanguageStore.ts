import { makeAutoObservable } from "mobx";

export class LanguageStore {
  output: string[] = []

  constructor() {
    makeAutoObservable(this);
  }
}