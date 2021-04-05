import { Component, OnInit } from '@angular/core';
import { Broadcaster } from '../../../services/broadcaster';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
	crossdata: any;
	enrollTab: any;

	constructor( private broadcaster: Broadcaster, ) { 
		// this.ngOnInit();
	}

	ngOnInit() {
		// this.broadcaster.sendMessage({openEnroll: 'Y'});
		this.crossdata = this.broadcaster.getMessage().subscribe(message => {
			if (message && message.enrollTab) {
				console.log('llego', message.enrollTab);
				this.enrollTab = message.enrollTab;
			}
		});
	}

}
