CREATE TABLE [Applicant] (
  [Id] int  NOT NULL,
  [FirstNameTh] nvarchar(50) COLLATE Thai_CI_AS  NOT NULL,
  [LastNameTh] nvarchar(50) COLLATE Thai_CI_AS  NOT NULL,
  [FirstNameEn] nvarchar(50) COLLATE Thai_CI_AS  NOT NULL,
  [LastNameEn] nvarchar(50) COLLATE Thai_CI_AS  NOT NULL,
  [Nickname] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [Sex] nvarchar(10) COLLATE Thai_CI_AS  NOT NULL,
  [Weight] decimal(18,2)  NOT NULL,
  [Height] decimal(18,2)  NOT NULL,
  [DateOfBirth] date  NOT NULL,
  [Age] int  NULL,
  [PlaceOfBirth] nvarchar(2000) COLLATE Thai_CI_AS  NOT NULL,
  [Address] nvarchar(2000) COLLATE Thai_CI_AS  NOT NULL,
  [Tel] nvarchar(25) COLLATE Thai_CI_AS  NOT NULL,
  [HomePhone] nvarchar(25) COLLATE Thai_CI_AS  NULL,
  [TelOffice] nvarchar(25) COLLATE Thai_CI_AS  NULL,
  [TelExt] nvarchar(25) COLLATE Thai_CI_AS  NULL,
  [Email] nvarchar(100) COLLATE Thai_CI_AS  NOT NULL,
  [Nationality] nvarchar(15) COLLATE Thai_CI_AS  NOT NULL,
  [Religion] nvarchar(15) COLLATE Thai_CI_AS  NOT NULL,
  [TaxNo] nvarchar(20) COLLATE Thai_CI_AS  NULL,
  [SocialSecurityNumber] nvarchar(20) COLLATE Thai_CI_AS  NULL,
  [Hospital] nvarchar(120) COLLATE Thai_CI_AS  NULL,
  [VISANo] nvarchar(20) COLLATE Thai_CI_AS  NULL,
  [VISAIssueAt] nvarchar(100) COLLATE Thai_CI_AS  NULL,
  [VISAIssueDate] date  NULL,
  [VISAExpiryDate] date  NULL,
  [WorkPermitNo] nvarchar(20) COLLATE Thai_CI_AS  NULL,
  [WorkPermitIssueAt] nvarchar(100) COLLATE Thai_CI_AS  NULL,
  [WorkPermitIssueDate] date  NULL,
  [WorkPermitExpiryDate] date  NULL,
  [IdNo] nvarchar(20) COLLATE Thai_CI_AS  NOT NULL,
  [IdNoIssueAt] nvarchar(100) COLLATE Thai_CI_AS  NOT NULL,
  [IdNoExpiryDate] date  NOT NULL,
  [BloodGroup] nvarchar(10) COLLATE Thai_CI_AS  NULL,
  [SoldierUsed] bit  NOT NULL,
  [SoldierReason] nvarchar(500) COLLATE Thai_CI_AS  NULL,
  [FatherName] nvarchar(200) COLLATE Thai_CI_AS  NOT NULL,
  [FatherStatus] bit  NOT NULL,
  [FatherAge] int  NULL,
  [FatherOccupation] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [FatherNationality] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [FatherCitizenship] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [FatherAddress] nvarchar(500) COLLATE Thai_CI_AS  NULL,
  [MotherName] nvarchar(200) COLLATE Thai_CI_AS  NOT NULL,
  [MotherStatus] bit  NOT NULL,
  [MotherAge] int  NULL,
  [MotherOccupation] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [MotherNationality] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [MotherCitizenship] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [MotherAddress] nvarchar(500) COLLATE Thai_CI_AS  NULL,
  [Marital] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [ComputerSkill] nvarchar(1000) COLLATE Thai_CI_AS  NULL,
  [OfficeSkill] nvarchar(1000) COLLATE Thai_CI_AS  NULL,
  [CarLicenseNo] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [CarLicenseType] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [CarLicenseExpiryDate] date  NULL,
  [MotorcycleLicenseNo] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [MotorcycleLicenseType] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [MotorcycleLicenseExpiryDate] date  NULL,
  [InternationalDrivingLicenseNo] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [InternationalIssueCountry] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [InternationalExpiryDate] date  NULL,
  [OtherSkill] nvarchar(500) COLLATE Thai_CI_AS  NULL,
  [ExtraActivities] nvarchar(1000) COLLATE Thai_CI_AS  NULL,
  [UpdatedOn] datetime  NULL,
  [SendMailStatus] bit  NULL,
  CONSTRAINT [PK_People] PRIMARY KEY CLUSTERED ([Id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO
ALTER TABLE [Applicant] SET (LOCK_ESCALATION = TABLE)
GO

CREATE TABLE [Brethren] (
  [Id] int  IDENTITY(1,1) NOT NULL,
  [Name] nvarchar(150) COLLATE Thai_CI_AS  NOT NULL,
  [Age] int  NULL,
  [Occupation] nvarchar(150) COLLATE Thai_CI_AS  NULL,
  [OfficeAddress] nvarchar(500) COLLATE Thai_CI_AS  NULL,
  [ApplicantId] int  NOT NULL,
  CONSTRAINT [PK_Brethren] PRIMARY KEY CLUSTERED ([Id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO
ALTER TABLE [Brethren] SET (LOCK_ESCALATION = TABLE)
GO

CREATE TABLE [Children] (
  [Id] int  IDENTITY(1,1) NOT NULL,
  [Name] nvarchar(200) COLLATE Thai_CI_AS  NULL,
  [Birthday] date  NULL,
  [IdCardNo] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [SchoolOfficeAddress] nvarchar(500) COLLATE Thai_CI_AS  NULL,
  [ApplicantId] int  NOT NULL,
  CONSTRAINT [PK_Children] PRIMARY KEY CLUSTERED ([Id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO
ALTER TABLE [Children] SET (LOCK_ESCALATION = TABLE)
GO

CREATE TABLE [Disease] (
  [Id] int  IDENTITY(1,1) NOT NULL,
  [Name] nvarchar(100) COLLATE Thai_CI_AS  NOT NULL,
  [Remark] nvarchar(500) COLLATE Thai_CI_AS  NULL,
  [DrugAllergy] nvarchar(500) COLLATE Thai_CI_AS  NULL,
  [ApplicantId] int  NOT NULL,
  CONSTRAINT [PK_Disease] PRIMARY KEY CLUSTERED ([Id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO
ALTER TABLE [Disease] SET (LOCK_ESCALATION = TABLE)
GO

CREATE TABLE [Education] (
  [Id] int  IDENTITY(1,1) NOT NULL,
  [Name] nvarchar(200) COLLATE Thai_CI_AS  NULL,
  [Level] nvarchar(200) COLLATE Thai_CI_AS  NULL,
  [FromYear] int  NULL,
  [ToYear] int  NULL,
  [CertificateDegree] nvarchar(200) COLLATE Thai_CI_AS  NULL,
  [Grade] decimal(18,2)  NULL,
  [Major] nvarchar(200) COLLATE Thai_CI_AS  NULL,
  [ApplicantId] int  NOT NULL,
  CONSTRAINT [PK_Education] PRIMARY KEY CLUSTERED ([Id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO
ALTER TABLE [Education] SET (LOCK_ESCALATION = TABLE)
GO

CREATE TABLE [Evaluations] (
  [Id] int  IDENTITY(1,1) NOT NULL,
  [UserId] nchar(20) COLLATE Thai_CI_AS  NULL,
  [Prefix] nchar(10) COLLATE Thai_CI_AS  NULL,
  [Startdate] date  NULL,
  [EvaluateFdate] date  NULL,
  [EvaluateTdate] date  NULL,
  [ServicesInYear] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [ProcessManager] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [PPASubject] nvarchar(max) COLLATE Thai_CI_AS  NULL,
  [PPAIssuedate] date  NULL,
  [DiscActionLevel] nvarchar(max) COLLATE Thai_CI_AS  NULL,
  [DiscActionIssuedate] date  NULL,
  [QOJRank] nchar(1) COLLATE Thai_CI_AS  NULL,
  [QOJRecord] nvarchar(max) COLLATE Thai_CI_AS  NULL,
  [QOJARank] nchar(1) COLLATE Thai_CI_AS  NULL,
  [QOJARecord] nvarchar(max) COLLATE Thai_CI_AS  NULL,
  [STWRank] nchar(1) COLLATE Thai_CI_AS  NULL,
  [STWRecord] nvarchar(max) COLLATE Thai_CI_AS  NULL,
  [WRRank] nchar(1) COLLATE Thai_CI_AS  NULL,
  [WRRecord] nvarchar(max) COLLATE Thai_CI_AS  NULL,
  [TWRank] nchar(1) COLLATE Thai_CI_AS  NULL,
  [TWRecord] nvarchar(max) COLLATE Thai_CI_AS  NULL,
  [PTRank] nchar(1) COLLATE Thai_CI_AS  NULL,
  [PTRecord] nvarchar(max) COLLATE Thai_CI_AS  NULL,
  [ATTActwork] nchar(10) COLLATE Thai_CI_AS  NULL,
  [ATTLeave] nchar(10) COLLATE Thai_CI_AS  NULL,
  [ATTActworkLeft] nchar(10) COLLATE Thai_CI_AS  NULL,
  [ATTRate] nchar(10) COLLATE Thai_CI_AS  NULL,
  [ATTRank] nchar(1) COLLATE Thai_CI_AS  NULL,
  [ATTTotal] nchar(10) COLLATE Thai_CI_AS  NULL,
  [OverallEvaluation] nchar(1) COLLATE Thai_CI_AS  NULL,
  [Half] nchar(1) COLLATE Thai_CI_AS  NULL,
  [TopicStr] nvarchar(max) COLLATE Thai_CI_AS  NULL,
  [AreaImp] nvarchar(max) COLLATE Thai_CI_AS  NULL,
  [Course] nvarchar(max) COLLATE Thai_CI_AS  NULL,
  [PlanGetdate] date  NULL,
  [OriginalDeptConf] nvarchar(100) COLLATE Thai_CI_AS  NULL,
  [AssociateFeedback] nvarchar(max) COLLATE Thai_CI_AS  NULL,
  [HumanResources] nvarchar(max) COLLATE Thai_CI_AS  NULL,
  [CreateBy] nchar(50) COLLATE Thai_CI_AS  NULL,
  [UpdateBy] nchar(50) COLLATE Thai_CI_AS  NULL,
  [CreateOn] datetime  NULL,
  [UpdateOn] datetime  NULL,
  CONSTRAINT [PK_Evaluation] PRIMARY KEY CLUSTERED ([Id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO
ALTER TABLE [Evaluations] SET (LOCK_ESCALATION = TABLE)
GO

CREATE TABLE [LanguageSkill] (
  [Id] int  IDENTITY(1,1) NOT NULL,
  [Language] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [Speaking] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [Reading] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [Writing] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [ApplicantId] int  NOT NULL,
  CONSTRAINT [PK_LanguageSkill] PRIMARY KEY CLUSTERED ([Id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO
ALTER TABLE [LanguageSkill] SET (LOCK_ESCALATION = TABLE)
GO

CREATE TABLE [MessageBoxes] (
  [Id] int  IDENTITY(1,1) NOT NULL,
  [Message] nvarchar(max) COLLATE Thai_CI_AS  NULL,
  [AdminUserId] nvarchar(100) COLLATE Thai_CI_AS  NULL,
  [UserId] nvarchar(100) COLLATE Thai_CI_AS  NULL,
  [IsRead] bit DEFAULT 0 NULL,
  [SenderUserId] nvarchar(100) COLLATE Thai_CI_AS  NULL,
  [CreatedOn] datetime DEFAULT getdate() NULL,
  CONSTRAINT [PK_MessegBox] PRIMARY KEY CLUSTERED ([Id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO
ALTER TABLE [MessageBoxes] SET (LOCK_ESCALATION = TABLE)
GO

CREATE TABLE [Question_answer] (
  [Id] int  IDENTITY(1,1) NOT NULL,
  [Questionid] int  NOT NULL,
  [Optionid] int  NOT NULL,
  [Lastupdated] datetime  NULL,
  CONSTRAINT [PK_question_answer_1] PRIMARY KEY CLUSTERED ([Questionid])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO
ALTER TABLE [Question_answer] SET (LOCK_ESCALATION = TABLE)
GO

CREATE TABLE [Question_options] (
  [Id] int  IDENTITY(1,1) NOT NULL,
  [Questionid] int  NOT NULL,
  [Questionoption] nvarchar(500) COLLATE Thai_CI_AS  NULL,
  [Lastupdated] datetime  NULL,
  [Image] nvarchar(500) COLLATE Thai_CI_AS  NULL,
  CONSTRAINT [PK_question_options] PRIMARY KEY CLUSTERED ([Id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO
ALTER TABLE [Question_options] SET (LOCK_ESCALATION = TABLE)
GO

CREATE TABLE [Question_responses] (
  [Id] int  IDENTITY(1,1) NOT NULL,
  [Responseid] int  NULL,
  [Questionid] int  NULL,
  [Optionid] int  NULL,
  [Lastupdated] datetime  NULL,
  [Reason] nvarchar(max) COLLATE Thai_CI_AS  NULL,
  CONSTRAINT [PK_question_responses] PRIMARY KEY CLUSTERED ([Id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO
ALTER TABLE [Question_responses] SET (LOCK_ESCALATION = TABLE)
GO

CREATE TABLE [Question_useradmin] (
  [Id] int  IDENTITY(1,1) NOT NULL,
  [Username] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [Password] nvarchar(50) COLLATE Thai_CI_AS  NULL
)
GO
ALTER TABLE [Question_useradmin] SET (LOCK_ESCALATION = TABLE)
GO

CREATE TABLE [QuizType] (
  [Id] int  NOT NULL,
  [Name] nvarchar(500) COLLATE Thai_CI_AS  NULL,
  [UpdatedOn] datetime  NULL,
  [UpdateBy] nvarchar(30) COLLATE Thai_CI_AS  NULL,
  CONSTRAINT [PK_QuizType] PRIMARY KEY CLUSTERED ([Id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO
ALTER TABLE [QuizType] SET (LOCK_ESCALATION = TABLE)
GO

CREATE TABLE [Quiz_questions] (
  [Id] int  NOT NULL,
  [Quizid] int  NOT NULL,
  [Questionorder] int  NULL,
  [Type] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [Title] nvarchar(2000) COLLATE Thai_CI_AS  NULL,
  [Lastupdated] datetime  NOT NULL,
  [Image] nvarchar(500) COLLATE Thai_CI_AS  NULL,
  CONSTRAINT [PK_quizquestions] PRIMARY KEY CLUSTERED ([Id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO
ALTER TABLE [Quiz_questions] SET (LOCK_ESCALATION = TABLE)
GO

CREATE TABLE [Quiz_responses] (
  [Id] int  NOT NULL,
  [Quizid] int  NULL,
  [UserId] nvarchar(200) COLLATE Thai_CI_AS  NULL,
  [Correctanswers] int  NULL,
  [Wronganswers] int  NULL,
  [Lastupdated] datetime  NULL,
  CONSTRAINT [PK_quizresponses] PRIMARY KEY CLUSTERED ([Id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO
ALTER TABLE [Quiz_responses] SET (LOCK_ESCALATION = TABLE)
GO

CREATE TABLE [Quizdetails] (
  [Id] int  NOT NULL,
  [Name] nvarchar(1000) COLLATE Thai_CI_AS  NULL,
  [Description] nvarchar(4000) COLLATE Thai_CI_AS  NULL,
  [QuizTypeId] int  NULL,
  [Completiondescription] nvarchar(4000) COLLATE Thai_CI_AS  NULL,
  [Startdate] datetime  NULL,
  [Enddate] datetime  NULL,
  [Termsandconditions] nvarchar(max) COLLATE Thai_CI_AS  NULL,
  [Lastupdated] datetime  NULL,
  [IsActive] bit  NULL,
  CONSTRAINT [PK_quizdetails] PRIMARY KEY CLUSTERED ([Id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO
ALTER TABLE [Quizdetails] SET (LOCK_ESCALATION = TABLE)
GO

CREATE TABLE [SkillMatrices] (
  [Id] int  IDENTITY(1,1) NOT NULL,
  [UserId] varchar(100) COLLATE Thai_CI_AS  NULL,
  [StationId] int  NULL,
  [Score] int  NULL,
  [LastUpdate] date  NULL,
  CONSTRAINT [PK_SkillMatrix] PRIMARY KEY CLUSTERED ([Id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO
ALTER TABLE [SkillMatrices] SET (LOCK_ESCALATION = TABLE)
GO

CREATE TABLE [Spouse] (
  [Id] int  IDENTITY(1,1) NOT NULL,
  [Name] nvarchar(200) COLLATE Thai_CI_AS  NOT NULL,
  [Occupation] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [Age] int  NULL,
  [RegisteredYear] int  NULL,
  [District] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [Province] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [IdCard] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [TaxIdNo] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [Address] nvarchar(500) COLLATE Thai_CI_AS  NULL,
  [WorkingAddress] nvarchar(500) COLLATE Thai_CI_AS  NULL,
  [NumberChildren] int  NULL,
  [NumberPatronized] int  NULL,
  [NumberSchoolingChildren] int  NULL,
  [ApplicantId] int  NOT NULL,
  CONSTRAINT [PK_Spouse] PRIMARY KEY CLUSTERED ([Id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO
ALTER TABLE [Spouse] SET (LOCK_ESCALATION = TABLE)
GO

CREATE TABLE [Stations] (
  [Id] int  IDENTITY(1,1) NOT NULL,
  [Name] varchar(100) COLLATE Thai_CI_AS  NULL,
  [Area] varchar(100) COLLATE Thai_CI_AS  NULL,
  CONSTRAINT [PK_Station] PRIMARY KEY CLUSTERED ([Id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO
ALTER TABLE [Stations] SET (LOCK_ESCALATION = TABLE)
GO

CREATE TABLE [Training] (
  [Id] int  IDENTITY(1,1) NOT NULL,
  [Course] nvarchar(200) COLLATE Thai_CI_AS  NULL,
  [HoldBy] nvarchar(200) COLLATE Thai_CI_AS  NULL,
  [Period] nvarchar(100) COLLATE Thai_CI_AS  NULL,
  [ApplicantId] int  NOT NULL,
  CONSTRAINT [PK_Training] PRIMARY KEY CLUSTERED ([Id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO
ALTER TABLE [Training] SET (LOCK_ESCALATION = TABLE)
GO

CREATE TABLE [Vocationals] (
  [Id] int  IDENTITY(1,1) NOT NULL,
  [UserId] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [HireDate] date  NULL,
  [PositionTitle] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [CostCenter] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [ReviewPeriod] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [SafetyRank] nchar(1) COLLATE Thai_CI_AS  NULL,
  [SafetyRecord] nvarchar(max) COLLATE Thai_CI_AS  NULL,
  [QualityRank] nchar(1) COLLATE Thai_CI_AS  NULL,
  [QualityRecord] nvarchar(max) COLLATE Thai_CI_AS  NULL,
  [ProJKnRank] nchar(1) COLLATE Thai_CI_AS  NULL,
  [ProJKnRecord] nvarchar(max) COLLATE Thai_CI_AS  NULL,
  [TeamWorkRank] nchar(1) COLLATE Thai_CI_AS  NULL,
  [TeamWorkRecord] nvarchar(max) COLLATE Thai_CI_AS  NULL,
  [PunctuallityRank] nchar(1) COLLATE Thai_CI_AS  NULL,
  [PunctuallityRecord] nvarchar(max) COLLATE Thai_CI_AS  NULL,
  [AreasforImp] nvarchar(max) COLLATE Thai_CI_AS  NULL,
  [OverallRatingPointSystem] nchar(1) COLLATE Thai_CI_AS  NULL,
  [OverallTotalpoint] nvarchar(2) COLLATE Thai_CI_AS  NULL,
  [StudentComments] nvarchar(max) COLLATE Thai_CI_AS  NULL,
  [Quarter] nchar(1) COLLATE Thai_CI_AS  NULL,
  [CreateBy] nchar(50) COLLATE Thai_CI_AS  NULL,
  [UpdateBy] nchar(50) COLLATE Thai_CI_AS  NULL,
  [CreateOn] datetime  NULL,
  [UpdateOn] datetime  NULL,
  CONSTRAINT [PK_Vocational] PRIMARY KEY CLUSTERED ([Id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO
ALTER TABLE [Vocationals] SET (LOCK_ESCALATION = TABLE)
GO

CREATE TABLE [WorkExperience] (
  [Id] int  IDENTITY(1,1) NOT NULL,
  [Name] nvarchar(1000) COLLATE Thai_CI_AS  NULL,
  [WorkFrom] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [WorkTo] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [Position] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [Responsibility] nvarchar(1000) COLLATE Thai_CI_AS  NULL,
  [SalaryStart] decimal(18,2)  NULL,
  [SalaryEnd] decimal(18,2)  NULL,
  [ReasonLeaving] nvarchar(500) COLLATE Thai_CI_AS  NULL,
  [ApplicantId] int  NOT NULL,
  CONSTRAINT [PK_WorkExperience] PRIMARY KEY CLUSTERED ([Id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO
ALTER TABLE [WorkExperience] SET (LOCK_ESCALATION = TABLE)
GO

CREATE TABLE [auth_AuthenticationSession] (
  [Id] nvarchar(32) COLLATE Thai_CI_AS  NOT NULL,
  [UserId] nvarchar(100) COLLATE Thai_CI_AS  NOT NULL,
  [UserDisplayName] nvarchar(100) COLLATE Thai_CI_AS  NULL,
  [MachineName] nvarchar(15) COLLATE Thai_CI_AS  NULL,
  [IP] nvarchar(15) COLLATE Thai_CI_AS  NULL,
  [CreatedOn] datetime  NOT NULL,
  [LastAccessedOn] datetime  NULL,
  [ExpireOn] datetime  NOT NULL,
  CONSTRAINT [PK_dbo.auth_AuthenticationSession] PRIMARY KEY CLUSTERED ([Id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO
ALTER TABLE [auth_AuthenticationSession] SET (LOCK_ESCALATION = TABLE)
GO

CREATE TABLE [auth_EventLog] (
  [Id] bigint  IDENTITY(1,1) NOT NULL,
  [Category] int  NOT NULL,
  [RefId] nvarchar(200) COLLATE Thai_CI_AS  NULL,
  [Event] nvarchar(200) COLLATE Thai_CI_AS  NULL,
  [Detail] nvarchar(max) COLLATE Thai_CI_AS  NULL,
  [ActorUserId] nvarchar(30) COLLATE Thai_CI_AS  NULL,
  [CreatedOn] datetime  NOT NULL,
  [Ref1] nvarchar(500) COLLATE Thai_CI_AS  NULL,
  [Ref2] nvarchar(500) COLLATE Thai_CI_AS  NULL,
  CONSTRAINT [PK_dbo.auth_EventLog] PRIMARY KEY CLUSTERED ([Id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO
ALTER TABLE [auth_EventLog] SET (LOCK_ESCALATION = TABLE)
GO

CREATE TABLE [auth_Item] (
  [Code] nvarchar(100) COLLATE Thai_CI_AS  NOT NULL,
  [Name] nvarchar(100) COLLATE Thai_CI_AS  NOT NULL,
  [Description] nvarchar(255) COLLATE Thai_CI_AS  NULL,
  [IsActive] bit  NOT NULL,
  [ModuleName] nvarchar(max) COLLATE Thai_CI_AS  NULL,
  CONSTRAINT [PK_dbo.auth_Item] PRIMARY KEY CLUSTERED ([Code])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO
ALTER TABLE [auth_Item] SET (LOCK_ESCALATION = TABLE)
GO

CREATE TABLE [auth_Role] (
  [Code] nvarchar(50) COLLATE Thai_CI_AS  NOT NULL,
  [Name] nvarchar(100) COLLATE Thai_CI_AS  NOT NULL,
  [Description] nvarchar(255) COLLATE Thai_CI_AS  NULL,
  [IsActive] bit  NOT NULL,
  [ModuleName] nvarchar(max) COLLATE Thai_CI_AS  NULL,
  CONSTRAINT [PK_dbo.auth_Role] PRIMARY KEY CLUSTERED ([Code])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO
ALTER TABLE [auth_Role] SET (LOCK_ESCALATION = TABLE)
GO

CREATE TABLE [auth_RoleItem] (
  [RoleCode] nvarchar(50) COLLATE Thai_CI_AS  NOT NULL,
  [ItemCode] nvarchar(100) COLLATE Thai_CI_AS  NOT NULL,
  CONSTRAINT [PK_dbo.auth_RoleItem] PRIMARY KEY CLUSTERED ([RoleCode], [ItemCode])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO
ALTER TABLE [auth_RoleItem] SET (LOCK_ESCALATION = TABLE)
GO

CREATE TABLE [auth_User] (
  [Id] nvarchar(100) COLLATE Thai_CI_AS  NOT NULL,
  [Password] nvarchar(255) COLLATE Thai_CI_AS  NULL,
  [LDAPUsername] nvarchar(100) COLLATE Thai_CI_AS  NULL,
  [AuthenticateBy] int  NOT NULL,
  [DisplayName] nvarchar(100) COLLATE Thai_CI_AS  NULL,
  [DisplayName2] nvarchar(100) COLLATE Thai_CI_AS  NULL,
  [Email] nvarchar(50) COLLATE Thai_CI_AS  NULL,
  [Department] nvarchar(100) COLLATE Thai_CI_AS  NULL,
  [Level] nvarchar(25) COLLATE Thai_CI_AS  NULL,
  [RedirectPage] nvarchar(500) COLLATE Thai_CI_AS  NULL,
  [ExpireOn] datetime  NULL,
  [IsActive] bit  NOT NULL,
  [LastLogonOn] datetime  NULL,
  [LastLogonMachineName] nvarchar(15) COLLATE Thai_CI_AS  NULL,
  [LastLogonIP] nvarchar(15) COLLATE Thai_CI_AS  NULL,
  [CreatedOn] datetime  NOT NULL,
  [CreatedUserId] nvarchar(30) COLLATE Thai_CI_AS  NULL,
  [UpdatedOn] datetime  NOT NULL,
  [UpdatedUserId] nvarchar(30) COLLATE Thai_CI_AS  NULL,
  [CFStr1] nvarchar(500) COLLATE Thai_CI_AS  NULL,
  [CFStr2] nvarchar(500) COLLATE Thai_CI_AS  NULL,
  [CFStr3] nvarchar(500) COLLATE Thai_CI_AS  NULL,
  [CFStr4] nvarchar(500) COLLATE Thai_CI_AS  NULL,
  [CFStr5] nvarchar(500) COLLATE Thai_CI_AS  NULL,
  [CFInt1] int  NULL,
  [CFInt2] int  NULL,
  [CFInt3] int  NULL,
  [CFInt4] int  NULL,
  [CFInt5] int  NULL,
  [CFDec1] decimal(18,5)  NULL,
  [CFDec2] decimal(18,5)  NULL,
  [CFDec3] decimal(18,5)  NULL,
  [CFDec4] decimal(18,5)  NULL,
  [CFDec5] decimal(18,5)  NULL,
  [CFDtm1] datetime  NULL,
  [CFDtm2] datetime  NULL,
  [CFDtm3] datetime  NULL,
  [CFDtm4] datetime  NULL,
  [CFDtm5] datetime  NULL,
  [BlockOn] datetime  NULL,
  [PasswordExpireOn] datetime  NULL,
  CONSTRAINT [PK_dbo.auth_User] PRIMARY KEY CLUSTERED ([Id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO
ALTER TABLE [auth_User] SET (LOCK_ESCALATION = TABLE)
GO

CREATE TABLE [auth_UserItem] (
  [UserId] nvarchar(100) COLLATE Thai_CI_AS  NOT NULL,
  [ItemCode] nvarchar(100) COLLATE Thai_CI_AS  NOT NULL,
  [CreatedOn] datetime  NOT NULL,
  [CreatedUserId] nvarchar(100) COLLATE Thai_CI_AS  NULL,
  CONSTRAINT [PK_dbo.auth_UserItem] PRIMARY KEY CLUSTERED ([UserId], [ItemCode])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO
ALTER TABLE [auth_UserItem] SET (LOCK_ESCALATION = TABLE)
GO

CREATE TABLE [auth_UserRole] (
  [UserId] nvarchar(100) COLLATE Thai_CI_AS  NOT NULL,
  [RoleCode] nvarchar(50) COLLATE Thai_CI_AS  NOT NULL,
  [CreatedOn] datetime  NOT NULL,
  [CreatedUserId] nvarchar(100) COLLATE Thai_CI_AS  NULL,
  CONSTRAINT [PK_dbo.auth_UserRole] PRIMARY KEY CLUSTERED ([UserId], [RoleCode])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO
ALTER TABLE [auth_UserRole] SET (LOCK_ESCALATION = TABLE)
GO

ALTER TABLE [Brethren] ADD CONSTRAINT [FK_Brethren_Applicant] FOREIGN KEY ([ApplicantId]) REFERENCES [Applicant] ([Id]) ON DELETE CASCADE ON UPDATE CASCADE
GO
ALTER TABLE [Children] ADD CONSTRAINT [FK_Children_Applicant] FOREIGN KEY ([ApplicantId]) REFERENCES [Applicant] ([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION
GO
ALTER TABLE [Disease] ADD CONSTRAINT [FK_Disease_Applicant] FOREIGN KEY ([ApplicantId]) REFERENCES [Applicant] ([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION
GO
ALTER TABLE [Education] ADD CONSTRAINT [FK_Education_Applicant] FOREIGN KEY ([ApplicantId]) REFERENCES [Applicant] ([Id]) ON DELETE CASCADE ON UPDATE CASCADE
GO
ALTER TABLE [LanguageSkill] ADD CONSTRAINT [FK_LanguageSkill_Applicant] FOREIGN KEY ([ApplicantId]) REFERENCES [Applicant] ([Id]) ON DELETE CASCADE ON UPDATE CASCADE
GO
ALTER TABLE [Question_answer] ADD CONSTRAINT [FK_question_answer_quizquestions] FOREIGN KEY ([Questionid]) REFERENCES [Quiz_questions] ([Id]) ON DELETE CASCADE ON UPDATE CASCADE
GO
ALTER TABLE [Question_options] ADD CONSTRAINT [FK_question_options_quizquestions] FOREIGN KEY ([Questionid]) REFERENCES [Quiz_questions] ([Id]) ON DELETE CASCADE ON UPDATE CASCADE
GO
ALTER TABLE [Question_responses] ADD CONSTRAINT [FK_question_responses_quiz_questions] FOREIGN KEY ([Questionid]) REFERENCES [Quiz_questions] ([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION
GO
ALTER TABLE [Question_responses] ADD CONSTRAINT [FK_question_responses_quizresponses] FOREIGN KEY ([Responseid]) REFERENCES [Quiz_responses] ([Id]) ON DELETE CASCADE ON UPDATE CASCADE
GO
ALTER TABLE [Quiz_questions] ADD CONSTRAINT [FK_quizquestions_quizdetails] FOREIGN KEY ([Quizid]) REFERENCES [Quizdetails] ([Id]) ON DELETE CASCADE ON UPDATE CASCADE
GO
ALTER TABLE [Quiz_responses] ADD CONSTRAINT [FK_quizresponses_quizdetails] FOREIGN KEY ([Quizid]) REFERENCES [Quizdetails] ([Id]) ON DELETE CASCADE ON UPDATE CASCADE
GO
ALTER TABLE [Quizdetails] ADD CONSTRAINT [FK_quizdetails_QuizType] FOREIGN KEY ([QuizTypeId]) REFERENCES [QuizType] ([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION
GO
ALTER TABLE [Spouse] ADD CONSTRAINT [FK_Spouse_Applicant] FOREIGN KEY ([ApplicantId]) REFERENCES [Applicant] ([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION
GO
ALTER TABLE [Training] ADD CONSTRAINT [FK_Training_Applicant] FOREIGN KEY ([ApplicantId]) REFERENCES [Applicant] ([Id]) ON DELETE CASCADE ON UPDATE CASCADE
GO
ALTER TABLE [WorkExperience] ADD CONSTRAINT [FK_WorkExperience_Applicant] FOREIGN KEY ([ApplicantId]) REFERENCES [Applicant] ([Id]) ON DELETE CASCADE ON UPDATE CASCADE
GO
ALTER TABLE [auth_AuthenticationSession] ADD CONSTRAINT [FK_dbo.auth_AuthenticationSession_dbo.auth_User_UserId] FOREIGN KEY ([UserId]) REFERENCES [auth_User] ([Id]) ON DELETE CASCADE ON UPDATE NO ACTION
GO
ALTER TABLE [auth_RoleItem] ADD CONSTRAINT [FK_dbo.auth_RoleItem_dbo.auth_Item_ItemCode] FOREIGN KEY ([ItemCode]) REFERENCES [auth_Item] ([Code]) ON DELETE NO ACTION ON UPDATE NO ACTION
GO
ALTER TABLE [auth_RoleItem] ADD CONSTRAINT [FK_dbo.auth_RoleItem_dbo.auth_Role_RoleCode] FOREIGN KEY ([RoleCode]) REFERENCES [auth_Role] ([Code]) ON DELETE NO ACTION ON UPDATE NO ACTION
GO
ALTER TABLE [auth_UserItem] ADD CONSTRAINT [FK_dbo.auth_UserItem_dbo.auth_Item_ItemCode] FOREIGN KEY ([ItemCode]) REFERENCES [auth_Item] ([Code]) ON DELETE CASCADE ON UPDATE NO ACTION
GO
ALTER TABLE [auth_UserItem] ADD CONSTRAINT [FK_dbo.auth_UserItem_dbo.auth_User_CreatedUserId] FOREIGN KEY ([CreatedUserId]) REFERENCES [auth_User] ([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION
GO
ALTER TABLE [auth_UserItem] ADD CONSTRAINT [FK_dbo.auth_UserItem_dbo.auth_User_UserId] FOREIGN KEY ([UserId]) REFERENCES [auth_User] ([Id]) ON DELETE CASCADE ON UPDATE NO ACTION
GO
ALTER TABLE [auth_UserRole] ADD CONSTRAINT [FK_dbo.auth_UserRole_dbo.auth_Role_RoleCode] FOREIGN KEY ([RoleCode]) REFERENCES [auth_Role] ([Code]) ON DELETE CASCADE ON UPDATE NO ACTION
GO
ALTER TABLE [auth_UserRole] ADD CONSTRAINT [FK_dbo.auth_UserRole_dbo.auth_User_CreatedUserId] FOREIGN KEY ([CreatedUserId]) REFERENCES [auth_User] ([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION
GO
ALTER TABLE [auth_UserRole] ADD CONSTRAINT [FK_dbo.auth_UserRole_dbo.auth_User_UserId] FOREIGN KEY ([UserId]) REFERENCES [auth_User] ([Id]) ON DELETE CASCADE ON UPDATE NO ACTION
GO

