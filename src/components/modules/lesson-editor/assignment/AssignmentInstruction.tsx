import { motion } from 'framer-motion';
import { format, isPast, formatDistanceToNow } from 'date-fns';
import { AlertTriangle, Award, Target, FileText } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { IAssignmentSchema } from '@/interface/studentAssignment.types';

interface AssignmentInstructionProps {
  assignment: IAssignmentSchema;
  onSubmit: () => void;
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const AssignmentInstruction = ({ assignment, onSubmit }: AssignmentInstructionProps) => {
  console.log(assignment,'assingment');
  const { instruction, deadline, maxMarks, passingMarks } = assignment;
  
  const hasDeadline = !!deadline;
  const isOverdue = hasDeadline && isPast(new Date(deadline));
  const timeRemaining = hasDeadline 
    ? formatDistanceToNow(new Date(deadline), { addSuffix: true }) 
    : null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="space-y-6"
    >
      {/* Deadline Alert */}
      {hasDeadline && (
        <motion.div variants={itemVariants}>
          <Alert variant={isOverdue ? 'destructive' : 'default'} className={!isOverdue ? 'border-orange-500/50 bg-orange-50 dark:bg-orange-950/20' : ''}>
            <AlertTriangle className={`h-4 w-4 ${isOverdue ? '' : 'text-orange-600'}`} />
            <AlertDescription className={isOverdue ? '' : 'text-orange-700 dark:text-orange-400'}>
              {isOverdue ? (
                <span className="font-medium">Deadline has passed!</span>
              ) : (
                <>
                  <span className="font-medium">Deadline:</span>{' '}
                  {format(new Date(deadline), 'PPP p')} ({timeRemaining})
                </>
              )}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Meta Info */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
        <Card className="border-0 bg-muted/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Max Marks</p>
              <p className="text-lg font-semibold text-foreground">{maxMarks}</p>
            </div>
          </CardContent>
        </Card>

        {passingMarks && (
          <Card className="border-0 bg-muted/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Passing Marks</p>
                <p className="text-lg font-semibold text-foreground">{passingMarks}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Instructions - Rich Text Display */}
      <motion.div variants={itemVariants}>
        <Card className="border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: instruction }}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Submit Action */}
      <motion.div variants={itemVariants}>
        <Button 
          onClick={onSubmit} 
          disabled={isOverdue && !assignment.allowMultipleSubmissions}
          className="w-full"
          size="lg"
        >
          Submit Assignment
        </Button>
        {isOverdue && !assignment.allowMultipleSubmissions && (
          <p className="text-xs text-destructive text-center mt-2">
            Submissions are closed for this assignment.
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AssignmentInstruction;
