class main {
    public video: HTMLVideoElement;
    private _duration: number = 0; // 缓存时长
  
    constructor(video: HTMLVideoElement) {
      if (!(video instanceof HTMLVideoElement)) {
        throw new Error("必须传入有效的HTMLVideoElement");
      }
      this.video = video;
  
      // 监听元数据加载
      this.video.addEventListener('loadedmetadata', () => {
        this._duration = this.video.duration;
        console.log("视频时长加载完成:", this._duration);
      });
    }
  
    // 开始播放（返回Promise处理异步）
    public async start(): Promise<void> {
      try {
        await this.video.play();
        console.log("播放成功");
      } catch (err) {
        console.error("播放失败:", err);
        throw err;
      }
    }
  
    // 暂停播放
    public stop(): void {
      this.video.pause();
      console.log("已暂停");
    }
  
    // 获取视频时长（安全版本）
    public getDuration(): number {
      return this._duration > 0 ? this._duration : this.video.duration || 0;
    }
  
    // 获取当前视频播放时间（安全版本）
    public getCurrentTime(): number {
      return this.video.currentTime || 0;
    }
  
    // 跳转到指定时间（带校验）
    public seek(time: number): void {
      const duration = this.getDuration();
      this.video.currentTime = Math.max(0, Math.min(time, duration));
    }
    //获取当前视频播放状态
    public getPlayState(): boolean {
      return this.video.paused;
    }
    //时间格式化函数
    public formatTime(time: number): string {
      if(time >=0 && time <60){
        return `00:${time.toFixed(2)}`;
      }
      else if(time >=60 && time <3600){
        let second = time % 60;
        return `${Math.floor(time / 60)}:${second.toFixed(2)}`
      }
      else{
        let hour = Math.floor(time / 3600);
        let minute = Math.floor(time / 60) % 60;
        let second = time % 60;
        return `${hour}:${minute.toFixed(2)}:${second.toFixed(2)}`  
      }
    }
  }

  export { main };