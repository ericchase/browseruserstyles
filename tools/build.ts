import { BunPlatform_Argv_Includes } from '../src/lib/ericchase/BunPlatform_Argv_Includes.js';
import { Step_Dev_Format } from './core-dev/step/Step_Dev_Format.js';
import { Step_Dev_Project_Update_Config } from './core-dev/step/Step_Dev_Project_Update_Config.js';
import { Processor_HTML_Custom_Component_Processor } from './core-web/processor/Processor_HTML_Custom_Component_Processor.js';
import { Processor_HTML_Remove_HotReload_On_Build } from './core-web/processor/Processor_HTML_Remove_HotReload_On_Build.js';
import { Step_Run_Dev_Server } from './core-web/step/Step_Run_Dev_Server.js';
import { Builder } from './core/Builder.js';
import { Processor_Set_Writable } from './core/processor/Processor_Set_Writable.js';
import { Step_Bun_Run } from './core/step/Step_Bun_Run.js';
import { Step_FS_Clean_Directory } from './core/step/Step_FS_Clean_Directory.js';
import { Step_Dev_Generate_Links } from './lib-browser-userscript/steps/Step_Dev_Generate_Links.js';

// await AddLoggerOutputDirectory('cache');

if (BunPlatform_Argv_Includes('--dev')) {
  Builder.SetMode(Builder.MODE.DEV);
}
Builder.SetVerbosity(Builder.VERBOSITY._1_LOG);

Builder.SetStartUpSteps(
  Step_Dev_Project_Update_Config({ project_path: '.' }),
  Step_Bun_Run({ cmd: ['bun', 'update', '--latest'], showlogs: false }),
  Step_Bun_Run({ cmd: ['bun', 'install'], showlogs: false }),
  Step_FS_Clean_Directory(Builder.Dir.Out),
  //
);

Builder.SetProcessorModules(
  Processor_HTML_Remove_HotReload_On_Build(),
  Processor_HTML_Custom_Component_Processor(),
  Processor_Set_Writable({ include_patterns: ['**/*.user.css'], value: true }),
  //
);

Builder.SetAfterProcessingSteps(
  Step_Dev_Generate_Links({ dirpath: Builder.Dir.Out, pattern: '**/*.user.css' }),
  Step_Run_Dev_Server(),
  //
);

Builder.SetCleanUpSteps(
  Step_Dev_Format({ showlogs: false }),
  //
);

await Builder.Start();
