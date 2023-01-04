import Model from './model/Model';
import ConnectionResolver from './database/ConnectionResolver';

Model.setConnectionResolver(new ConnectionResolver());
