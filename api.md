

## 上传文件


**接口地址**:`/admin/file/upload`


**请求方式**:`POST`


**请求数据类型**:`multipart/form-data`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|file|file|formData|true|file||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|Response|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|data||object||
|errCode||string||
|message||string||
|success||boolean||


**响应示例**:
```javascript
{
	"data": {},
	"errCode": "",
	"message": "",
	"success": true
}
```



## 博客基础信息获取


**接口地址**:`/admin/blog/settings/details`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|Response|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|data||object||
|errCode||string||
|message||string||
|success||boolean||


**响应示例**:
```javascript
{
	"data": {},
	"errCode": "",
	"message": "",
	"success": true
}
```



## 博客基础信息修改


**接口地址**:`/admin/blog/settings/update`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "author": "",
  "avatar": "",
  "csdnHomepage": "",
  "giteeHomepage": "",
  "githubHomepage": "",
  "introduction": "",
  "logo": "",
  "name": "",
  "zhihuHomepage": ""
}
```


**请求参数**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|updateBlogSettingsReqVO|updateBlogSettingsReqVO|body|true|修改博客设置请求 VO|修改博客设置请求 VO|
|&emsp;&emsp;author|||false|string||
|&emsp;&emsp;avatar|||false|string||
|&emsp;&emsp;csdnHomepage|||false|string||
|&emsp;&emsp;giteeHomepage|||false|string||
|&emsp;&emsp;githubHomepage|||false|string||
|&emsp;&emsp;introduction|||false|string||
|&emsp;&emsp;logo|||false|string||
|&emsp;&emsp;name|||false|string||
|&emsp;&emsp;zhihuHomepage|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|Response|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|data||object||
|errCode||string||
|message||string||
|success||boolean||


**响应示例**:
```javascript
{
	"data": {},
	"errCode": "",
	"message": "",
	"success": true
}
```