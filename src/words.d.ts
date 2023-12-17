// 定义
import { TreeDataProvider, ExtensionContext } from 'vscode';
import createSimpleGit, { SimpleGit } from 'simple-git';

type TypeNode = {};

class WordsApp {
  constructor(context: ExtensionContext);
  providerWillMastering: TreeDataProvider;
  providerMastered: TreeDataProvider;
  git: SimpleGit;
  storage: Storage;
  refresh();
  selected(String: text);
  didMastered(item: TypeNode);
  willMastering(item: TypeNode);
  read(item: TypeNode)
};