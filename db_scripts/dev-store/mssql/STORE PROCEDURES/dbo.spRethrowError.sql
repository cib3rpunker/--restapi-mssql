USE [dev-store]
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE object_id = OBJECT_ID(N'[dbo].[spRethrowError]') AND type in (N'P', N'PC'))
BEGIN
  DROP PROCEDURE dbo.spRethrowError
END
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[spRethrowError] AS

-- Snarfed from http://technet.microsoft.com/en-us/library/ms179296.aspx
-- Usable in the CATCH block of a TRY-CATCH statement.

IF ERROR_NUMBER() IS NULL
    RETURN

DECLARE 
    @ErrorMessage    NVARCHAR(4000),
    @ErrorNumber     INT,
    @ErrorSeverity   INT,
    @ErrorState      INT,
    @ErrorLine       INT,
    @ErrorProcedure  NVARCHAR(200),
    @MaxAllowedSeverity INT,
    @ErrorSeverityToUse INT 

SELECT 
    @ErrorNumber = ERROR_NUMBER(),
    @ErrorSeverity = ERROR_SEVERITY(),
    @ErrorState = ERROR_STATE(),
    @ErrorLine = ERROR_LINE(),
    @ErrorProcedure = ISNULL(ERROR_PROCEDURE(), '-'),
    @MaxAllowedSeverity = 18, -- Can't throw an error with severity > 18 unless sysadmin and using WITH LOG option
    @ErrorSeverityToUse = 
		CASE
			WHEN @ErrorSeverity > @MaxAllowedSeverity THEN @MaxAllowedSeverity
			ELSE @ErrorSeverity
		END
		
SELECT @ErrorMessage = 
    N'Error %d, Severity %d, State %d, Procedure %s, Line %d, ' + 
        'Message: '+ ERROR_MESSAGE()

RAISERROR 
	(
	@ErrorMessage, 
	@ErrorSeverityToUse,
	1,               
	@ErrorNumber,    -- parameter: original error number.
	@ErrorSeverity,  -- parameter: original error severity.
	@ErrorState,     -- parameter: original error state.
	@ErrorProcedure, -- parameter: original error procedure name.
	@ErrorLine       -- parameter: original error line number.
	)

GO
