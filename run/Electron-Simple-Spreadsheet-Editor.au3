#pragma compile(Icon, '../app/imgs/table.ico')
FileChangeDir(@ScriptDir)
If $CmdLine[0] = False Then
   ShellExecute('run.bat', "", "", "", @SW_HIDE)
   Exit
EndIf

For $i = 1 To $CmdLine[0]
   ShellExecute('run.bat', $CmdLine[$i], "", "", @SW_HIDE)
Next


;FileChangeDir("D:\xampp\htdocs\projects-electron\Electron-Simple-Spreadsheet-Editor")
;ShellExecute('electron', 'electron/main.js --mode production --file "D:\xampp\htdocs\projects-electron\Electron-Simple-Spreadsheet-Editor\demo-data\file_example_ODS_10.ods"', "", "", @SW_HIDE)