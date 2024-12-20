
INSERT [auth_Item] ([Code], [Name], [Description], [IsActive], [ModuleName]) VALUES (N'ADMIN', N'Administrator', NULL, 1, N'Admin')
INSERT [auth_Item] ([Code], [Name], [Description], [IsActive], [ModuleName]) VALUES (N'APT-001', N'Report', NULL, 1, N'Admin')
INSERT [auth_Item] ([Code], [Name], [Description], [IsActive], [ModuleName]) VALUES (N'APT-002', N'Recruitment Test', NULL, 1, N'Admin')
INSERT [auth_Item] ([Code], [Name], [Description], [IsActive], [ModuleName]) VALUES (N'APT-003', N'In-Program Test', NULL, 1, N'Admin')
INSERT [auth_Item] ([Code], [Name], [Description], [IsActive], [ModuleName]) VALUES (N'APT-004', N'Qualification Test', NULL, 1, N'Admin')
INSERT [auth_Item] ([Code], [Name], [Description], [IsActive], [ModuleName]) VALUES (N'APT-005', N'Upload Quiz', NULL, 1, N'Admin')
INSERT [auth_Item] ([Code], [Name], [Description], [IsActive], [ModuleName]) VALUES (N'APT-006', N'Quiz Report', NULL, 1, N'Admin')
INSERT [auth_Item] ([Code], [Name], [Description], [IsActive], [ModuleName]) VALUES (N'APT-007', N'Message', NULL, 1, N'Admin')
INSERT [auth_Item] ([Code], [Name], [Description], [IsActive], [ModuleName]) VALUES (N'USER', N'User', NULL, 1, N'User')
--add new
INSERT [auth_Item] ([Code], [Name], [Description], [IsActive], [ModuleName]) VALUES (N'APT-008', N'Import Recruitment Data', NULL, 1, N'Admin')
INSERT [auth_Item] ([Code], [Name], [Description], [IsActive], [ModuleName]) VALUES (N'APT-009', N'Export Recruitment Data', NULL, 1, N'Admin')
INSERT [auth_Item] ([Code], [Name], [Description], [IsActive], [ModuleName]) VALUES (N'APT-010', N'Performance Evaluation', NULL, 1, N'Admin')
INSERT [auth_Item] ([Code], [Name], [Description], [IsActive], [ModuleName]) VALUES (N'APT-011', N'Vocational Evaluation', NULL, 1, N'Admin')
INSERT [auth_Item] ([Code], [Name], [Description], [IsActive], [ModuleName]) VALUES (N'APT-012', N'Skill Matrix Evaluation', NULL, 1, N'Admin')
INSERT [auth_Item] ([Code], [Name], [Description], [IsActive], [ModuleName]) VALUES (N'APT-013', N'Work station Setting', NULL, 1, N'Admin')
GO

INSERT [QuizType] ([Id], [Name], [UpdatedOn], [UpdateBy]) VALUES (1, N'Recruitment', CAST(N'2021-03-29T00:00:00.000' AS DateTime), N'admin')
INSERT [QuizType] ([Id], [Name], [UpdatedOn], [UpdateBy]) VALUES (2, N'In-Program', CAST(N'2021-03-29T00:00:00.000' AS DateTime), N'admin')
INSERT [QuizType] ([Id], [Name], [UpdatedOn], [UpdateBy]) VALUES (3, N'Qualification', CAST(N'2021-03-29T00:00:00.000' AS DateTime), N'admin')
GO
SET IDENTITY_INSERT [Stations] ON 

INSERT [Stations] ([Id], [Name], [Area]) VALUES (1, N'Q-Gate', N'Qaulity TV-425')
INSERT [Stations] ([Id], [Name], [Area]) VALUES (2, N'Analysis', N'Qaulity TV-425')
INSERT [Stations] ([Id], [Name], [Area]) VALUES (3, N'Audit', N'Qaulity TV-425')
INSERT [Stations] ([Id], [Name], [Area]) VALUES (4, N'PreAssembly', N'Motorrad EX-T-Z-5')
INSERT [Stations] ([Id], [Name], [Area]) VALUES (5, N'Trim Line', N'Motorrad EX-T-Z-5')
INSERT [Stations] ([Id], [Name], [Area]) VALUES (6, N'Final Line', N'Motorrad EX-T-Z-5')
INSERT [Stations] ([Id], [Name], [Area]) VALUES (7, N'Trim Line', N'Production TV-424')
INSERT [Stations] ([Id], [Name], [Area]) VALUES (8, N'Over Herd', N'Production TV-424')
INSERT [Stations] ([Id], [Name], [Area]) VALUES (9, N'Rework', N'Production TV-424')
INSERT [Stations] ([Id], [Name], [Area]) VALUES (10, N'Support Assembly', N'Production TV-424')
INSERT [Stations] ([Id], [Name], [Area]) VALUES (11, N'Pack Check', N'Logistics TV-4216')
INSERT [Stations] ([Id], [Name], [Area]) VALUES (12, N'Unloading Container', N'Logistics TV-4216')
INSERT [Stations] ([Id], [Name], [Area]) VALUES (13, N'Supermarket', N'Logistics TV-4216')
INSERT [Stations] ([Id], [Name], [Area]) VALUES (14, N'EV', N'Logistics TV-4216')
INSERT [Stations] ([Id], [Name], [Area]) VALUES (15, N'Shordate', N'Logistics TV-4216')
SET IDENTITY_INSERT [Stations] OFF
GO
