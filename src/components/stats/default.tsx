import { Calendar, Clock, CloudSun, GanttChart, Users } from "lucide-react";

export default function Stats() {
  return (
    <>
      <div className="container mx-auto px-6 py-40" id="stats">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Crash Statistics Overview
          </h2>
          <p className="text-muted-foreground mt-2">
            Summary of 0000 crashes from 2016 to 2023
          </p>
        </div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div className="stat-card">
            <div className="flex justify-between items-start">
              <div>
                <div className="stat-value">00000</div>
                <div className="stat-label">Total Crashes</div>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <GanttChart className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex justify-between items-start">
              <div>
                <div className="stat-value">000</div>
                <div className="stat-label">Peak Month</div>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="stat-comparison">
              <span>0000</span>
              <span className="text-muted-foreground ml-1">crashes</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex justify-between items-start">
              <div>
                <div className="stat-value">0000</div>
                <div className="stat-label">Peak Day</div>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="stat-comparison">
              <span>0000</span>
              <span className="text-muted-foreground ml-1">crashes</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex justify-between items-start">
              <div>
                <div className="stat-value">000:00</div>
                <div className="stat-label">Peak Hour</div>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Clock className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="stat-comparison">
              <span>0000</span>
              <span className="text-muted-foreground ml-1">crashes</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex justify-between items-start">
              <div>
                <div className="stat-value">xxxxxx</div>
                <div className="stat-label">Top Weather Condition</div>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <CloudSun className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="stat-comparison">
              <span>xxxxx</span>
              <span className="text-muted-foreground ml-1">crashes</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex justify-between items-start">
              <div>
                <div className="stat-value">xxxx</div>
                <div className="stat-label">Top Light Condition</div>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <CloudSun className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="stat-comparison">
              <span>xxxx</span>
              <span className="text-muted-foreground ml-1">crashes</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex justify-between items-start">
              <div>
                <div className="stat-value">M xxx%</div>
                <div className="stat-label">Gender Distribution</div>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="stat-comparison">
              <span>F xxxx%</span>
              <span className="text-muted-foreground ml-1">of total</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex justify-between items-start">
              <div>
                <div className="stat-value">xxxx</div>
                <div className="stat-label">Most Affected Age</div>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="stat-comparison">
              <span>xxxxx</span>
              <span className="text-muted-foreground ml-1">crashes</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
