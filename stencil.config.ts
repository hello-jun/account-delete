/*
 * @Author: zhangjun
 * @Date: 2023-03-08 11:46:16
 * @LastEditors: zhangjun
 * @LastEditTime: 2023-03-08 15:38:32
 * @Description: 
 * @FilePath: /stencil.config.ts
 */
import { Config } from '@stencil/core'

export const config: Config = {
  namespace: 'account-delete',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
    {
      type: 'docs-vscode',
      file: 'vscode-data.json',
    },
  ],
  devServer: {
    reloadStrategy: 'pageReload',
  }
}
